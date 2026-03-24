from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings
import logging
from typing import Optional

settings = get_settings()
logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

db = Database()

async def connect_to_mongo():
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db.client = client
        db.db = client.law_simulator
        logger.info("Connected to MongoDB!")
        
        # Ensure indexes
        if db.db is not None:
            await db.db.users.create_index("email", unique=True)
            await db.db.sessions.create_index("session_id", unique=True)
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")

async def close_mongo_connection():
    client = db.client
    if client is not None:
        client.close()
        logger.info("Closed MongoDB connection.")

def get_db():
    return db.db
