"""
RAG Retriever for AI Legal Courtroom Simulator
Combines document processing, embeddings, and vector store for legal knowledge retrieval
"""

from typing import List, Dict, Optional, Tuple
import json
from app.ai_system.rag.document_processor import LegalDocumentProcessor, LegalDocumentType
from app.ai_system.rag.embeddings import GeminiEmbeddings
from app.ai_system.rag.vector_store import VectorStore
from app.config import get_settings


class RAGRetriever:
    """
    Main RAG system that ties together document processing, embeddings, and retrieval
    """
    
    def __init__(self, api_key: str = None, vector_db_path: str = None):
        """
        Initialize RAG retriever
        
        Args:
            api_key: Google Gemini API key
            vector_db_path: Path to vector database
        """
        if api_key is None:
            settings = get_settings()
            api_key = settings.GEMINI_API_KEY
        
        if vector_db_path is None:
            settings = get_settings()
            vector_db_path = settings.VECTOR_DB_PATH
        
        # Initialize components
        self.embedder = GeminiEmbeddings(api_key=api_key)
        self.vector_store = VectorStore(persist_directory=vector_db_path)
        self.processor = LegalDocumentProcessor()
    
    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        doc_types: Optional[List[LegalDocumentType]] = None,
        section_filter: Optional[str] = None
    ) -> List[Dict]:
        """
        Retrieve relevant legal documents for a query
        
        Args:
            query: User query or argument
            top_k: Number of results to return
            doc_types: Filter by document types
            section_filter: Filter by specific section number
            
        Returns:
            List of retrieved documents with content, metadata, and relevance scores
        """
        # Build filter
        filter_dict = {}
        if doc_types:
            filter_dict['doc_type'] = {'$in': [dt.value for dt in doc_types]}
        if section_filter:
            filter_dict['section_number'] = section_filter
        
        # Generate query embedding
        query_embedding = self.embedder.embed_query(query)
        
        # Search vector store
        results = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
            filter_dict=filter_dict if filter_dict else None
        )
        
        return results
    
    def build_context(
        self,
        query: str,
        retrieved_docs: List[Dict],
        case_facts: Optional[Dict] = None,
        user_argument: Optional[str] = None
    ) -> str:
        """
        Build context prompt for LLM from retrieved documents
        
        Args:
            query: Original query
            retrieved_docs: List of retrieved documents
            case_facts: Optional case facts
            user_argument: Optional user argument
            
        Returns:
            Formatted context string
        """
        context_parts = [
            "# RELEVANT LEGAL PROVISIONS\n",
            "You are an AI legal assistant. Use ONLY the following legal provisions to respond. Do not hallucinate or invent legal sections.\n\n"
        ]
        
        for idx, doc in enumerate(retrieved_docs, 1):
            section_info = f"Section {doc['metadata'].get('section_number', 'N/A')}" if doc['metadata'].get('section_number') else "Provision"
            act_info = doc['metadata'].get('doc_type', 'Unknown Act')
            
            context_parts.append(f"## {idx}. {act_info} - {section_info}\n")
            context_parts.append(f"{doc['content']}\n\n")
            context_parts.append(f"[Relevance Score: {doc['score']:.3f}]\n\n")
        
        if case_facts:
            context_parts.append("# CASE FACTS\n")
            context_parts.append(json.dumps(case_facts, indent=2))
            context_parts.append("\n\n")
        
        if user_argument:
            context_parts.append("# USER ARGUMENT\n")
            context_parts.append(user_argument)
            context_parts.append("\n\n")
        
        context_parts.append("# QUERY\n")
        context_parts.append(query)
        
        return ''.join(context_parts)
    
    def add_document_file(self, filepath: str) -> None:
        """
        Process and add a document file to the RAG system
        
        Args:
            filepath: Path to the document file
        """
        # Process document
        chunks = self.processor.process_document(filepath)
        
        # Generate embeddings
        texts = [chunk.content for chunk in chunks]
        embeddings = self.embedder.embed_documents(texts)
        
        # Add to vector store
        self.vector_store.add_documents(chunks, embeddings)
        
        print(f"Added {len(chunks)} chunks from {filepath}")
    
    def add_document_text(
        self,
        text: str,
        doc_type: LegalDocumentType,
        section_number: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> None:
        """
        Add document text directly to the RAG system
        
        Args:
            text: Document text content
            doc_type: Type of legal document
            section_number: Optional section number
            metadata: Additional metadata
        """
        # Chunk the text
        chunks = self.processor.chunk_by_section(text, doc_type)
        
        # Update chunk metadata
        if metadata:
            for chunk in chunks:
                chunk.metadata.update(metadata)
        if section_number:
            for chunk in chunks:
                chunk.section_number = section_number
        
        # Generate embeddings
        texts = [chunk.content for chunk in chunks]
        embeddings = self.embedder.embed_documents(texts)
        
        # Add to vector store
        self.vector_store.add_documents(chunks, embeddings)
        
        print(f"Added {len(chunks)} chunks to vector store")
    
    def get_relevant_sections(
        self,
        query: str,
        section_numbers: List[str],
        doc_type: LegalDocumentType = None
    ) -> List[Dict]:
        """
        Get specific sections by number with relevance ranking
        
        Args:
            query: Query for relevance ranking
            section_numbers: List of section numbers to retrieve
            doc_type: Optional document type filter
            
        Returns:
            List of relevant sections
        """
        all_results = []
        
        for section_num in section_numbers:
            # Get documents by section
            section_docs = self.vector_store.get_by_section(section_num, doc_type.value if doc_type else None)
            all_results.extend(section_docs)
        
        # Re-rank by relevance to query
        if all_results:
            query_embedding = self.embedder.embed_query(query)
            
            # Simple relevance scoring (could be enhanced with cross-encoder)
            for doc in all_results:
                doc_embedding = self.embedder.embed_query(doc['content'][:500])  # Use first 500 chars
                # Simple cosine similarity approximation
                similarity = self._cosine_similarity(query_embedding, doc_embedding)
                doc['score'] = similarity
            
            # Sort by relevance
            all_results.sort(key=lambda x: x['score'], reverse=True)
        
        return all_results
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Calculate cosine similarity between two vectors
        
        Args:
            vec1: First vector
            vec2: Second vector
            
        Returns:
            Cosine similarity score
        """
        import math
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(b * b for b in vec2))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def get_stats(self) -> Dict:
        """Get RAG system statistics"""
        return self.vector_store.get_collection_stats()
    
    def clear_database(self) -> None:
        """Clear all documents from the RAG system"""
        self.vector_store.clear()
        print("RAG database cleared")


# Example usage
if __name__ == "__main__":
    # Initialize RAG retriever
    retriever = RAGRetriever()
    
    # Sample query
    query = "What is the difference between murder and culpable homicide?"
    
    # Retrieve relevant documents
    results = retriever.retrieve(query, top_k=3)
    
    print(f"Retrieved {len(results)} documents for query: {query}")
    
    # Build context
    case_facts = {
        "case_id": "STATE_V_RAMESH",
        "victim": "Suresh Kumar",
        "date": "2024-01-15",
        "nature": "Death due to injury"
    }
    
    context = retriever.build_context(
        query=query,
        retrieved_docs=results,
        case_facts=case_facts
    )
    
    print(f"Context length: {len(context)} characters")
    print("Context preview:")
    print(context[:500] + "...")
    
    # Get stats
    stats = retriever.get_stats()
    print(f"RAG stats: {stats}")
