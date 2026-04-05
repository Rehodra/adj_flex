"""
Dummy Vector Store (Memory Optimized)
Placeholder for AI Legal Courtroom Simulator
Replaces ChromaDB to stay under Render's 512MB RAM limit.
"""

from typing import List, Dict, Optional, Tuple
import uuid
from app.ai_system.rag.document_processor import LegalChunk
from app.config import get_settings

class VectorStore:
    """
    Dummy vector store that does NOT require ChromaDB.
    Always returns empty search results to keep memory usage low on Render.
    """
    
    def __init__(self, persist_directory: str = None, collection_name: str = "legal_docs"):
        """
        Initialize dummy vector store
        """
        self.persist_directory = persist_directory or "./dummy_db"
        self.collection_name = collection_name
        print(f"Dummy Vector Store initialized for collection: {collection_name}")
    
    def add_documents(self, chunks: List[LegalChunk], embeddings: List[List[float]]) -> None:
        """
        No-op for dummy store
        """
        print(f"No-op: Dummy store skipped adding {len(chunks)} documents.")
    
    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Always returns empty search results
        """
        print("Dummy search called - returning empty results.")
        return []
    
    def search_by_text(
        self,
        query_text: str,
        top_k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Always returns empty search results
        """
        return []
    
    def get_by_section(self, section_number: str, doc_type: str = None) -> List[Dict]:
        """
        Always returns empty results
        """
        return []
    
    def get_collection_stats(self) -> Dict:
        """
        Dummy collection stats
        """
        return {
            'collection_name': self.collection_name,
            'document_count': 0,
            'mode': 'dummy'
        }
    
    def clear(self) -> None:
        """
        No-op
        """
        pass
    
    def delete_by_filter(self, filter_dict: Dict) -> None:
        """
        No-op
        """
        pass
