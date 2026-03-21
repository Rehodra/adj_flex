from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SARVAM_API_KEY = "sk_dzrizpd1_yxAojy7fnBUgeGutx0lzCfrF"


@app.post("/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):

    audio_bytes = await file.read()

    response = requests.post(
        "https://api.sarvam.ai/speech-to-text",
        headers={
            "api-subscription-key": SARVAM_API_KEY
        },
        files={
            "file": ("recording.wav", audio_bytes, "audio/wav")
        },
        data={
            "model": "saaras:v3",
            "mode": "translate",
            "language_code": "unknown"
        }
    )

    result = response.json()
    print(result)

    return {
        "transcript": result.get("transcript", "No transcript")
    }