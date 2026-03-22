"""
Vector Store for AI Legal Courtroom Simulator
Uses ChromaDB for local persistent vector storage
"""

from typing import List, Dict, Optional, Tuple
import chromadb
from chromadb.config import Settings
import uuid
from app.ai_system.rag.document_processor import LegalChunk
from app.config import get_settings


class VectorStore:
    """
    ChromaDB-based vector store for legal document embeddings
    """
    
    def __init__(self, persist_directory: str = None, collection_name: str = "legal_docs"):
        """
        Initialize ChromaDB vector store
        
        Args:
            persist_directory: Directory to store vector database
            collection_name: Name of the collection
        """
        if persist_directory is None:
            settings = get_settings()
            persist_directory = settings.VECTOR_DB_PATH
        
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Legal documents for AI courtroom simulator"}
        )
    
    def add_documents(self, chunks: List[LegalChunk], embeddings: List[List[float]]) -> None:
        """
        Add legal document chunks with embeddings to vector store
        
        Args:
            chunks: List of LegalChunk objects
            embeddings: List of embedding vectors
        """
        if len(chunks) != len(embeddings):
            raise ValueError("Number of chunks must match number of embeddings")
        
        ids = []
        documents = []
        metadatas = []
        
        for chunk, embedding in zip(chunks, embeddings):
            # Generate unique ID
            doc_id = str(uuid.uuid4())
            ids.append(doc_id)
            
            # Document content
            documents.append(chunk.content)
            
            # Metadata for filtering
            metadata = {
                'doc_type': chunk.doc_type.value,
                'section_number': chunk.section_number or '',
                'act_year': chunk.act_year or 0,
                'chapter': chunk.chapter or '',
                'chunk_id': chunk.chunk_id,
                **chunk.metadata
            }
            metadatas.append(metadata)
        
        # Add to collection
        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )
        
        print(f"Added {len(chunks)} documents to vector store")
    
    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for similar documents
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
            filter_dict: Metadata filters
            
        Returns:
            List of search results with content, metadata, and scores
        """
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=filter_dict
            )
            
            # Format results
            formatted_results = []
            if results['ids'] and results['ids'][0]:
                for i in range(len(results['ids'][0])):
                    formatted_result = {
                        'id': results['ids'][0][i],
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'score': results['distances'][0][i] if results['distances'] else 0.0
                    }
                    formatted_results.append(formatted_result)
            
            return formatted_results
            
        except Exception as e:
            print(f"Error searching vector store: {e}")
            return []
    
    def search_by_text(
        self,
        query_text: str,
        top_k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search by text (ChromaDB will handle embedding internally)
        
        Args:
            query_text: Query text string
            top_k: Number of results to return
            filter_dict: Metadata filters
            
        Returns:
            List of search results
        """
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=top_k,
                where=filter_dict
            )
            
            # Format results
            formatted_results = []
            if results['ids'] and results['ids'][0]:
                for i in range(len(results['ids'][0])):
                    formatted_result = {
                        'id': results['ids'][0][i],
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'score': results['distances'][0][i] if results['distances'] else 0.0
                    }
                    formatted_results.append(formatted_result)
            
            return formatted_results
            
        except Exception as e:
            print(f"Error searching vector store by text: {e}")
            return []
    
    def get_by_section(self, section_number: str, doc_type: str = None) -> List[Dict]:
        """
        Get documents by section number
        
        Args:
            section_number: Section number to search for
            doc_type: Optional document type filter
            
        Returns:
            List of matching documents
        """
        filter_dict = {'section_number': section_number}
        if doc_type:
            filter_dict['doc_type'] = doc_type
        
        # Get all documents matching the filter
        try:
            results = self.collection.get(
                where=filter_dict,
                include=['documents', 'metadatas']
            )
            
            formatted_results = []
            if results['ids']:
                for i in range(len(results['ids'])):
                    formatted_result = {
                        'id': results['ids'][i],
                        'content': results['documents'][i],
                        'metadata': results['metadatas'][i],
                        'score': 0.0  # No relevance score for direct lookup
                    }
                    formatted_results.append(formatted_result)
            
            return formatted_results
            
        except Exception as e:
            print(f"Error getting documents by section: {e}")
            return []
    
    def get_collection_stats(self) -> Dict:
        """
        Get statistics about the collection
        
        Returns:
            Dictionary with collection statistics
        """
        try:
            count = self.collection.count()
            return {
                'collection_name': self.collection_name,
                'document_count': count,
                'persist_directory': self.persist_directory
            }
        except Exception as e:
            print(f"Error getting collection stats: {e}")
            return {'error': str(e)}
    
    def clear(self) -> None:
        """Clear all documents from the collection"""
        try:
            # Delete the collection and recreate it
            self.client.delete_collection(name=self.collection_name)
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"description": "Legal documents for AI courtroom simulator"}
            )
            print("Vector store cleared successfully")
        except Exception as e:
            print(f"Error clearing vector store: {e}")
    
    def delete_by_filter(self, filter_dict: Dict) -> None:
        """
        Delete documents matching the filter
        
        Args:
            filter_dict: Metadata filter for documents to delete
        """
        try:
            # Get matching document IDs first
            results = self.collection.get(where=filter_dict)
            if results['ids']:
                self.collection.delete(ids=results['ids'])
                print(f"Deleted {len(results['ids'])} documents")
        except Exception as e:
            print(f"Error deleting documents: {e}")


# Example usage
if __name__ == "__main__":
    # Initialize vector store
    vector_store = VectorStore(persist_directory="./test_vector_db")
    
    # Sample data
    from app.ai_system.rag.document_processor import LegalChunk, LegalDocumentType
    
    sample_chunks = [
        LegalChunk(
            content="Section 300 - Murder: Except in the cases hereinafter excepted, culpable homicide is murder...",
            doc_type=LegalDocumentType.IPC,
            section_number="300",
            act_year=1860,
            metadata={"offense_type": "Offenses Affecting Life"},
            chunk_id="test_chunk_1"
        ),
        LegalChunk(
            content="Section 302 - Punishment for murder: Whoever commits murder shall be punished with death...",
            doc_type=LegalDocumentType.IPC,
            section_number="302",
            act_year=1860,
            metadata={"offense_type": "Offenses Affecting Life"},
            chunk_id="test_chunk_2"
        )
    ]
    
    # Sample embeddings (768 dimensions for Gemini)
    sample_embeddings = [
        [0.1] * 768,  # Mock embedding for chunk 1
        [0.2] * 768   # Mock embedding for chunk 2
    ]
    
    # Add documents
    vector_store.add_documents(sample_chunks, sample_embeddings)
    
    # Get stats
    stats = vector_store.get_collection_stats()
    print(f"Collection stats: {stats}")
    
    # Search
    query_embedding = [0.15] * 768  # Mock query embedding
    search_results = vector_store.search(query_embedding, top_k=2)
    print(f"Search results: {len(search_results)} documents found")
    
    # Search by section
    section_results = vector_store.get_by_section("300")
    print(f"Section 300 results: {len(section_results)} documents found")
