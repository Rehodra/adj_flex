"""
Dummy Local Embeddings (Memory Optimized)
Placeholder for AI Legal Courtroom Simulator
Replaces local sentence-transformers to stay under Render's 512MB RAM limit.
"""

from typing import List, Optional

class GeminiEmbeddings:
    """
    Dummy embedding implementation that does NOT require sentence-transformers or torch.
    Returns zero-vectors to allow the app to function without crashing on low-memory environments.
    """
    
    def __init__(self, api_key: str = None, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize dummy embeddings
        """
        self.model_name = model_name
        self._dimension = 384 # Standard for all-MiniLM-L6-v2
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Returns dummy zero-embeddings
        """
        return [[0.0] * self._dimension for _ in texts]
    
    def embed_query(self, query: str) -> List[float]:
        """
        Returns a dummy zero-embedding
        """
        return [0.0] * self._dimension
    
    def get_embedding_dimension(self) -> int:
        """
        Returns the dummy embedding dimension
        """
        return self._dimension


if __name__ == "__main__":
    embeddings = GeminiEmbeddings()
    print("Dummy Embeddings initialized successfully.")
