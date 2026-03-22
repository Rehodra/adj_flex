import os
from sentence_transformers import SentenceTransformer
from app.ai_system.rag.vector_store import VectorStore
from app.ai_system.rag.document_processor import LegalChunk, LegalDocumentType

# Initialize embedding model (same as used elsewhere)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Base directory for legal docs
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'legal_docs'))
IPC_DIR = os.path.join(BASE_DIR, 'ipc')

def load_ipc_files():
    files = []
    for fname in os.listdir(IPC_DIR):
        if fname.lower().endswith('.txt'):
            files.append(os.path.join(IPC_DIR, fname))
    return files

def create_chunks(file_path):
    # Simple approach: treat whole file as one chunk
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    # Extract section number from filename e.g., section_299.txt
    section_number = os.path.splitext(os.path.basename(file_path))[0].replace('section_', '')
    chunk = LegalChunk(
        content=content,
        doc_type=LegalDocumentType.IPC,
        section_number=section_number,
        act_year=1860,
        metadata={},
        chunk_id=f"ipc_{section_number}"
    )
    return [chunk]

def main():
    vector_store = VectorStore()  # uses default VECTOR_DB_PATH
    ipc_files = load_ipc_files()
    all_chunks = []
    for fpath in ipc_files:
        chunks = create_chunks(fpath)
        all_chunks.extend(chunks)
    # Generate embeddings for each chunk
    texts = [c.content for c in all_chunks]
    embeddings = model.encode(texts, show_progress_bar=True).tolist()
    # Add to vector store
    vector_store.add_documents(all_chunks, embeddings)
    print(f"✅ Indexed {len(all_chunks)} IPC sections into vector store.")

if __name__ == '__main__':
    main()
