from fastapi import APIRouter, UploadFile, File, HTTPException
import requests
import os
from app.config import get_settings

router = APIRouter()
_settings = get_settings()

@router.post("/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):
    """
    Takes an audio file (regional Indian language), 
    sends it to Sarvam AI for transcription & translation to English, 
    and returns the translated transcript.
    """
    try:
        
        audio_bytes = await file.read()
        
        response = requests.post(
            "https://api.sarvam.ai/speech-to-text",
            headers={"api-subscription-key": _settings.SARVAM_API_KEY},
            files={
                "file": ("recording.wav", audio_bytes, "audio/wav")
            },
            data={
                "model": "saaras:v3",
                "mode": "translate",
                "language_code": "unknown"
            }
        )
        
        if response.status_code != 200:
            error_data = response.json()
            raise HTTPException(status_code=response.status_code, detail=f"Sarvam AI Error: {error_data}")
            
        result = response.json()
        print("Sarvam API Result:", result)
        
        return {
            "transcript": result.get("transcript", "No transcript"),
            "success": True
        }
    except Exception as e:
        print("STT Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
