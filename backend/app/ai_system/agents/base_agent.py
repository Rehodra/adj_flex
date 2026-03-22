"""
Base Agent for AI Legal Courtroom Simulator
Supports both Google Gemini and Groq API providers
"""

from abc import ABC, abstractmethod
from typing import Dict, Optional, Any, List
import time
import json
from app.config import get_settings
from app.ai_system.utils.response_parser import parse_json_response


class BaseAgent(ABC):
    """
    Base class for AI agents.
    Supports Gemini and Groq providers via AI_PROVIDER setting.
    """
    
    def __init__(self, api_key: str, model_name: str = "gemini-2.0-flash"):
        """
        Initialize the AI agent
        
        Args:
            api_key: API key (Gemini or Groq depending on provider setting)
            model_name: Model name (auto-selected based on provider if default)
        """
        settings = get_settings()
        self.provider = getattr(settings, 'AI_PROVIDER', 'gemini').lower()
        self._rate_limit_delay = 0.5
        
        if self.provider == "groq":
            from groq import Groq
            groq_key = getattr(settings, 'GROQ_API_KEY', api_key)
            self.groq_client = Groq(api_key=groq_key)
            self.model_name = getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile')
            self.client = None
        else:
            from google import genai
            self.client = genai.Client(api_key=api_key)
            self.model_name = model_name
            self.groq_client = None
    
    def _generate_response(
        self,
        prompt: str,
        system_prompt: str = None,
        max_tokens: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Generate response from the configured AI provider
        """
        try:
            time.sleep(self._rate_limit_delay)
            
            if self.provider == "groq":
                return self._generate_groq(prompt, system_prompt, max_tokens, temperature)
            else:
                return self._generate_gemini(prompt, system_prompt, max_tokens, temperature)
                
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"Error: Unable to generate response - {str(e)}"
    
    def _generate_gemini(self, prompt, system_prompt, max_tokens, temperature):
        """Generate using Google Gemini API"""
        from google.genai import types
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
                system_instruction=system_prompt if system_prompt else None
            )
        )
        return response.text
    
    def _generate_groq(self, prompt, system_prompt, max_tokens, temperature):
        """Generate using Groq API (OpenAI-compatible)"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = self.groq_client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content
    
    def _generate_structured_response(
        self,
        prompt: str,
        system_prompt: str = None,
        expected_format: str = "json"
    ) -> Dict:
        """
        Generate structured response (JSON) from AI
        """
        format_instruction = f"\n\nIMPORTANT: Respond ONLY with valid {expected_format.upper()}. No additional text."
        full_prompt = prompt + format_instruction
        
        response_text = self._generate_response(full_prompt, system_prompt)
        
        if expected_format.lower() == "json":
            return parse_json_response(response_text)
        else:
            return {"response": response_text}
    
    def _generate_with_retry(
        self,
        prompt: str,
        system_prompt: str = None,
        max_retries: int = 3,
        **kwargs
    ) -> str:
        """
        Generate response with retry logic
        """
        for attempt in range(max_retries):
            try:
                return self._generate_response(prompt, system_prompt, **kwargs)
            except Exception as e:
                if attempt == max_retries - 1:
                    print(f"Failed after {max_retries} attempts: {e}")
                    return f"Error: Failed to generate response after {max_retries} attempts"
                else:
                    print(f"Retry {attempt + 1}/{max_retries}: {e}")
                    time.sleep(1)
        
        return "Error: Unexpected error in retry logic"
    
    def _validate_response(self, response: str, required_keys: List[str] = None) -> bool:
        """
        Validate response format and content
        """
        if not response or response.strip() == "":
            return False
        
        if required_keys:
            try:
                parsed = json.loads(response)
                return all(key in parsed for key in required_keys)
            except json.JSONDecodeError:
                return False
        
        return True
    
    @abstractmethod
    def generate_response(self, context: str, **kwargs) -> dict:
        """Abstract method for generating agent-specific responses"""
        pass
    
    def get_model_info(self) -> Dict:
        """Get information about the model being used"""
        return {
            "model_name": self.model_name,
            "provider": "Groq" if self.provider == "groq" else "Google Gemini",
            "capabilities": ["text_generation", "json_response"],
            "rate_limit_delay": self._rate_limit_delay
        }
    
    def test_connection(self) -> bool:
        """Test the API connection"""
        try:
            test_prompt = "Respond with 'Connection successful' to test the API."
            response = self._generate_response(test_prompt)
            return "Connection successful" in response or "successful" in response.lower()
        except Exception as e:
            print(f"Connection test failed: {e}")
            return False
