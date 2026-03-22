import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.config import get_settings
import chromadb

def inspect_database():
    settings = get_settings()
    print(f"📁 Database Path: {settings.VECTOR_DB_PATH}")
    
    # Connect to the Chroma Database
    client = chromadb.PersistentClient(path=settings.VECTOR_DB_PATH)
    
    # Get all collections (in our case, 'legal_documents')
    collections = client.list_collections()
    if not collections:
        print("❌ No collections found in the database. Did you run the indexing script?")
        return
        
    print(f"\n📚 Found {len(collections)} collection(s).")
    
    for collection_meta in collections:
        name = collection_meta.name
        print(f"\n--- Inspecting Collection: {name} ---")
        
        collection = client.get_collection(name=name)
        count = collection.count()
        print(f"📊 Total Documents Indexed: {count}")
        
        if count > 0:
            print("\n👀 Printing the first 3 documents as examples:")
            
            # Retrieve a few items to visualize
            results = collection.peek(limit=3)
            
            for i in range(len(results['ids'])):
                doc_id = results['ids'][i]
                metadata = results['metadatas'][i]
                text_preview = results['documents'][i][:150].replace('\n', ' ') + "..."
                
                print(f"\n🔹 Document ID: {doc_id}")
                print(f"   Metadata: {metadata}")
                print(f"   Text Snippet: \"{text_preview}\"")

if __name__ == "__main__":
    inspect_database()
