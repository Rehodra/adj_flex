from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
from datetime import datetime, timedelta
from app.config import get_settings
from app.db import db
from app.models.user import UserCreate, UserInDB
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()
logger = logging.getLogger(__name__)

class TokenRequest(BaseModel):
    credential: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@router.post("/google", response_model=TokenResponse)
async def google_auth(request: TokenRequest):
    try:
        # Verify Google Token
        idinfo = id_token.verify_oauth2_token(
            request.credential, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        # Check if user exists in MongoDB
        user_coll = db.db.users
        user = await user_coll.find_one({"email": email})

        if not user:
            # Create new user
            new_user = {
                "email": email,
                "name": name,
                "picture": picture,
                "provider": "google",
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow()
            }
            result = await user_coll.insert_one(new_user)
            user_id = str(result.inserted_id)
        else:
            # Update last login
            await user_coll.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": datetime.utcnow(), "picture": picture, "name": name}}
            )
            user_id = str(user["_id"])

        # Create JWT Token
        access_token_expires = timedelta(days=7)
        access_token = create_access_token(
            data={"sub": email, "id": user_id}, expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": email,
                "name": name,
                "picture": picture
            }
        }

    except ValueError as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"Google auth error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
