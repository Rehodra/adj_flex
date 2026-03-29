from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import httpx
import jwt
from datetime import datetime, timedelta
from urllib.parse import urlencode
from app.config import get_settings
from app.db import db
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


def _ensure_google_oauth_config() -> None:
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET or not settings.GOOGLE_REDIRECT_URI:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.",
        )


def _jwt_secret() -> str:
    return settings.JWT_SECRET_KEY or settings.SECRET_KEY


def _jwt_algorithm() -> str:
    return settings.JWT_ALGORITHM or "HS256"

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, _jwt_secret(), algorithm=_jwt_algorithm())
    return encoded_jwt


async def _upsert_google_user(email: str, name: str, picture: str) -> str:
    user_coll = db.db.users
    user = await user_coll.find_one({"email": email})

    if not user:
        new_user = {
            "email": email,
            "name": name,
            "picture": picture,
            "provider": "google",
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        }
        result = await user_coll.insert_one(new_user)
        return str(result.inserted_id)

    await user_coll.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow(), "picture": picture, "name": name}},
    )
    return str(user["_id"])


def _build_auth_response(email: str, name: str, picture: str, user_id: str) -> dict:
    access_token = create_access_token(
        data={"sub": email, "id": user_id},
        expires_delta=timedelta(days=7),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
        },
    }


@router.get("/google")
async def google_login(frontend_redirect: str | None = Query(default=None)):
    _ensure_google_oauth_config()

    oauth_state = None
    if frontend_redirect:
        oauth_state = jwt.encode(
            {
                "frontend_redirect": frontend_redirect,
                "exp": datetime.utcnow() + timedelta(minutes=10),
            },
            _jwt_secret(),
            algorithm=_jwt_algorithm(),
        )

    query_params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    if oauth_state:
        query_params["state"] = oauth_state

    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(query_params)}"
    return RedirectResponse(url=google_auth_url, status_code=302)


@router.get("/google/callback", response_model=TokenResponse)
async def google_callback(
    code: str | None = Query(default=None),
    error: str | None = Query(default=None),
    state: str | None = Query(default=None),
):
    _ensure_google_oauth_config()

    if error:
        raise HTTPException(status_code=400, detail=f"Google OAuth error: {error}")
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code from Google OAuth callback")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
            token_response.raise_for_status()
            token_data = token_response.json()

        google_id_token = token_data.get("id_token")
        if not google_id_token:
            raise HTTPException(status_code=401, detail="Google OAuth did not return an id_token")

        idinfo = id_token.verify_oauth2_token(
            google_id_token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Google OAuth did not return a valid user email")

        name = idinfo.get("name", "")
        picture = idinfo.get("picture", "")

        user_id = await _upsert_google_user(email=email, name=name, picture=picture)
        auth_payload = _build_auth_response(email=email, name=name, picture=picture, user_id=user_id)

        frontend_redirect = settings.GOOGLE_FRONTEND_SUCCESS_URI
        if state:
            try:
                state_payload = jwt.decode(state, _jwt_secret(), algorithms=[_jwt_algorithm()])
                frontend_redirect = state_payload.get("frontend_redirect") or frontend_redirect
            except Exception:
                logger.warning("Invalid OAuth state token received; falling back to default frontend redirect")

        if frontend_redirect:
            redirect_query = urlencode(
                {
                    "token": auth_payload["access_token"],
                    "email": email,
                    "name": name,
                    "picture": picture,
                }
            )
            separator = "&" if "?" in frontend_redirect else "?"
            return RedirectResponse(url=f"{frontend_redirect}{separator}{redirect_query}", status_code=302)

        return auth_payload

    except httpx.HTTPStatusError as e:
        logger.error(f"Google token exchange failed: {e.response.text}")
        raise HTTPException(status_code=401, detail="Failed to exchange authorization code with Google")
    except ValueError as e:
        logger.error(f"Google ID token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Google OAuth callback error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/google", response_model=TokenResponse)
async def google_auth(request: TokenRequest):
    _ensure_google_oauth_config()
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

        user_id = await _upsert_google_user(email=email, name=name, picture=picture)
        return _build_auth_response(email=email, name=name, picture=picture, user_id=user_id)

    except ValueError as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"Google auth error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
