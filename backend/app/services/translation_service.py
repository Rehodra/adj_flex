"""
Translation Service for Multilingual Support
Handles translation between English and Indian languages using Google Translate
"""

import httpx
from typing import Optional
import urllib.parse
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    """Service for translating text between languages"""
    
    # Language code mappings for Google Translate
    LANGUAGE_CODES = {
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
    
    def __init__(self):
        """Initialize translation service"""
        self.available = True
        self.timeout = 10
            
    async def translate(self, 
                       text: str, 
                       target_language: str, 
                       source_language: str = "English") -> str:
        """
        Translate text from source language to target language
        
        Args:
            text: Text to translate
            target_language: Target language name
            source_language: Source language name (default: English)
            
        Returns:
            Translated text
        """
        if not text or text.strip() == "":
            return text
            
        # If source and target are the same, no need to translate
        if source_language == target_language:
            return text
            
        # If target is English, return original text
        if target_language == "English":
            return text
            
        try:
            source_code = self.LANGUAGE_CODES.get(source_language, "en")
            target_code = self.LANGUAGE_CODES.get(target_language, "en")
            
            # Use Google Translate API via simple HTTP request
            async with httpx.AsyncClient() as client:
                # Using Google Translate API endpoint
                url = "https://translate.googleapis.com/translate_a/element.js"
                params = {
                    "cb": "googleTranslateElementInit"
                }
                
                # Alternative: Use the simple translation API
                # This is a workaround that doesn't require authentication
                encoded_text = urllib.parse.quote(text)
                translate_url = f"https://translate.google.com/translate_a/single?client=gtx&sl={source_code}&tl={target_code}&dt=t&q={encoded_text}"
                
                response = await client.get(translate_url, timeout=self.timeout)
                
                if response.status_code == 200:
                    import json
                    try:
                        data = response.json()
                        # Extract translated text from nested array
                        if data and data[0]:
                            translated_text = ""
                            for item in data[0]:
                                if item[0]:
                                    translated_text += item[0]
                            return translated_text if translated_text else text
                    except Exception as e:
                        logger.warning(f"Error parsing translation response: {e}")
            
            return text
        except Exception as e:
            logger.warning(f"Translation error: {e}")
            return text
    
    async def translate_to_english(self, 
                                  text: str, 
                                  source_language: str) -> str:
        """
        Translate text from any language to English
        
        Args:
            text: Text to translate
            source_language: Source language name
            
        Returns:
            English translation
        """
        return await self.translate(text, "English", source_language)
    
    async def translate_from_english(self, 
                                    text: str, 
                                    target_language: str) -> str:
        """
        Translate text from English to target language
        
        Args:
            text: English text to translate
            target_language: Target language name
            
        Returns:
            Translated text
        """
        return await self.translate(text, target_language, "English")
    
    def is_available(self) -> bool:
        """Check if translation service is available"""
        return self.available


# Global instance
_translation_service = None

def get_translation_service() -> TranslationService:
    """Get or initialize translation service"""
    global _translation_service
    if _translation_service is None:
        _translation_service = TranslationService()
    return _translation_service


# Global instance
_translation_service = None

def get_translation_service() -> TranslationService:
    """Get or initialize translation service"""
    global _translation_service
    if _translation_service is None:
        _translation_service = TranslationService()
    return _translation_service
