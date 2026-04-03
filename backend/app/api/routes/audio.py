from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import StreamingResponse
import requests
import os
from app.config import get_settings
from gtts import gTTS
import io
import logging

router = APIRouter()
_settings = get_settings()
logger = logging.getLogger(__name__)

# Language to language code mappings for gTTS
LANGUAGE_CODES_TTS = {
    "English": "en",
    "Hindi": "hi",
    "Bengali": "bn",
    "Telugu": "te",
    "Marathi": "mr",
    "Tamil": "ta",
    "Urdu": "ur",
    "Gujarati": "gu",
    "Kannada": "kn",
    "Odia": "or",
    "Odiya": "or",
    "Malayalam": "ml",
    "Punjabi": "pa",
    "Assamese": "as",
    "Maithili": "mai",
    "Santali": "sat",
    "Kashmiri": "ks",
    "Nepali": "ne",
    "Sindhi": "sd",
    "Dogri": "doi",
    "Konkani": "kok",
    "Manipuri": "mni",
    "Bodo": "brx",
    "Sanskrit": "sa"
}

@router.post("/speech-to-text")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = Query("English")
):
    """
    Takes an audio file (regional Indian language), 
    sends it to Sarvam AI for transcription & translation to English, 
    and returns the translated transcript.
    
    Args:
        file: Audio file (wav/mp3)
        language: Language of the audio (optional)
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
        logger.info(f"Sarvam API Result: {result}")
        
        return {
            "transcript": result.get("transcript", "No transcript"),
            "language": language,
            "success": True
        }
    except Exception as e:
        logger.error(f"STT Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tts")
async def text_to_speech(
    text: str = Query(..., min_length=1),
    language: str = Query("English"),
    role: str = Query("opponent")
):
    """
    Convert text to speech in the specified language using Sarvam AI with gTTS fallback.
    
    Args:
        text: Text to convert to speech
        language: Target language
        role: Role/persona (for future use)
        
    Returns:
        Audio stream (MP3 or WAV)
    """
    try:
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Sarvam AI TTS mapping with recommended speakers
        # Using Female voices (ishita/priya/roopa/neha/pooja) as default for opponent
        sarvam_tts_languages = {
            "English": {"code": "en-IN", "speaker": "ishita"},
            "Hindi": {"code": "hi-IN", "speaker": "priya"},
            "Bengali": {"code": "bn-IN", "speaker": "roopa"},
            "Telugu": {"code": "te-IN", "speaker": "priya"},
            "Marathi": {"code": "mr-IN", "speaker": "priya"},
            "Tamil": {"code": "ta-IN", "speaker": "ishita"},
            "Gujarati": {"code": "gu-IN", "speaker": "priya"},
            "Kannada": {"code": "kn-IN", "speaker": "neha"},
            "Odia": {"code": "od-IN", "speaker": "pooja"},
            "Odiya": {"code": "od-IN", "speaker": "pooja"},
            "Malayalam": {"code": "ml-IN", "speaker": "pooja"},
            "Punjabi": {"code": "pa-IN", "speaker": "roopa"}
        }

        sarvam_lang = sarvam_tts_languages.get(language)

        if sarvam_lang and _settings.SARVAM_API_KEY:
            try:
                # Sarvam AI TTS REST API has a limit of 2500 characters
                text_to_synthesize = text[:2500]
                
                payload = {
                    "inputs": [text_to_synthesize],
                    "target_language_code": sarvam_lang["code"],
                    "speaker": sarvam_lang["speaker"],
                    "model": "bulbul:v3"
                }

                logger.info(f"Attempting Sarvam AI TTS for language: {language}")
                
                response = requests.post(
                    "https://api.sarvam.ai/text-to-speech",
                    headers={
                        "api-subscription-key": _settings.SARVAM_API_KEY,
                        "Content-Type": "application/json"
                    },
                    json=payload,
                    timeout=15
                )

                if response.status_code == 200:
                    result = response.json()
                    audio_base64 = result.get("audios", [None])[0]
                    if audio_base64:
                        import base64
                        audio_data = base64.b64decode(audio_base64)
                        logger.info(f"Successfully generated Sarvam TTS")
                        return StreamingResponse(
                            iter([audio_data]),
                            media_type="audio/wav",
                            headers={"Content-Disposition": "inline; filename=audio.wav"}
                        )
                else:
                    logger.warning(f"Sarvam AI TTS Error: {response.text}. Falling back to gTTS.")

            except Exception as e:
                logger.warning(f"Sarvam API exception: {str(e)}. Falling back to gTTS.")

        # Fallback to gTTS
        # Get language code for gTTS
        lang_code = LANGUAGE_CODES_TTS.get(language, "en")
        
        # Create gTTS object
        tts = gTTS(text=text, lang=lang_code, slow=False)
        
        # Save to BytesIO
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        logger.info(f"Generated gTTS fallback for language: {language} (code: {lang_code})")
        
        return StreamingResponse(
            iter([audio_buffer.getvalue()]),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=audio.mp3"}
        )
        
    except Exception as e:
        logger.error(f"TTS Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
