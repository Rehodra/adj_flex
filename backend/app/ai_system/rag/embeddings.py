"""
Local Sentence Transformer Embeddings
Embeddings for AI Legal Courtroom Simulator
Uses local sentence-transformers model — no API key needed, no rate limits
"""

from typing import List, Dict, Optional


class GeminiEmbeddings:
    """
    Local embedding implementation using sentence-transformers.
    Runs entirely on your machine — no API calls, no quota issues.
    
    Note: Class name kept as GeminiEmbeddings for backward compatibility
    with the rest of the codebase.
    """
    
    def __init__(self, api_key: str = None, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize local embeddings
        
        Args:
            api_key: Ignored (kept for backward compatibility)
            model_name: Sentence transformer model name
        """
        from sentence_transformers import SentenceTransformer
        
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name
        self._dimension = self.model.get_sentence_embedding_dimension()
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed multiple documents
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            List of embedding vectors
        """
        embeddings = self.model.encode(texts, show_progress_bar=False)
        return [emb.tolist() for emb in embeddings]
    
    def embed_query(self, query: str) -> List[float]:
        """
        Embed a single query
        
        Args:
            query: Query string to embed
            
        Returns:
            Query embedding vector
        """
        embedding = self.model.encode(query, show_progress_bar=False)
        return embedding.tolist()
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of embeddings
        
        Returns:
            Embedding dimension
        """
        return self._dimension


if __name__ == "__main__":
    embeddings = GeminiEmbeddings()
    
    texts = [
        "The prosecution must prove guilt beyond reasonable doubt.",
        "Section 302 IPC deals with murder charges.",
        "Evidence must be relevant and admissible."
    ]
    
    vectors = embeddings.embed_documents(texts)
    
    print(f"Generated {len(vectors)} embeddings")
    print(f"Embedding dimension: {len(vectors[0])}")
    
    query = "What is the burden of proof?"
    query_vector = embeddings.embed_query(query)
    print(f"Query embedding dimension: {len(query_vector)}")
