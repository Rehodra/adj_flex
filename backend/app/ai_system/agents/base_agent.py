"""
Base Agent for AI Legal Courtroom Simulator
Provides common Gemini setup and functionality for AI agents
"""

from abc import ABC, abstractmethod
from typing import Dict, Optional, Any, List
import time
import json
from google import genai
from google.genai import types
from groq import Groq
from app.config import get_settings
from app.ai_system.utils.response_parser import parse_json_response


class BaseAgent(ABC):
    """
    Base class for AI agents using Gemini
    """
    
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash", provider: str = "gemini"):
        """
        Initialize the AI agent
        
        Args:
            api_key: API key
            model_name: Model name
            provider: 'gemini' or 'groq'
        """
        self.provider = provider.lower()
        self.model_name = model_name
        self._rate_limit_delay = 0.5  # 500ms between requests
        
        if self.provider == "groq":
            self.client = Groq(api_key=api_key)
        else:
            self.client = genai.Client(api_key=api_key)
    
    def _generate_response(
        self,
        prompt: str,
        system_prompt: str = None,
        max_tokens: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Generate response from Gemini
        
        Args:
            prompt: The main prompt
            system_prompt: Optional system instructions
            max_tokens: Maximum tokens in response
            temperature: Response randomness (0.0-1.0)
            
        Returns:
            Generated text response
        """
        try:
            # Add rate limiting
            time.sleep(self._rate_limit_delay)
            
            if self.provider == "groq":
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                return response.choices[0].message.content
                
            else:
                # Prepare messages for Gemini
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                # Generate response using Gemini API
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
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"Error: Unable to generate response - {str(e)}"
    
    def _generate_structured_response(
        self,
        prompt: str,
        system_prompt: str = None,
        expected_format: str = "json"
    ) -> Dict:
        """
        Generate structured response (JSON) from Gemini
        
        Args:
            prompt: The main prompt
            system_prompt: Optional system instructions
            expected_format: Expected response format
            
        Returns:
            Parsed dictionary response
        """
        # Add format instruction to prompt
        format_instruction = f"\n\nIMPORTANT: Respond ONLY with valid {expected_format.upper()}. No additional text."
        full_prompt = prompt + format_instruction
        
        # Generate response
        response_text = self._generate_response(full_prompt, system_prompt)
        
        # Parse structured response
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
        
        Args:
            prompt: The main prompt
            system_prompt: Optional system instructions
            max_retries: Maximum retry attempts
            **kwargs: Additional parameters for _generate_response
            
        Returns:
            Generated text response
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
                    time.sleep(1)  # Wait before retry
        
        return "Error: Unexpected error in retry logic"
    
    def _validate_response(self, response: str, required_keys: List[str] = None) -> bool:
        """
        Validate response format and content
        
        Args:
            response: Response string to validate
            required_keys: List of required keys for JSON responses
            
        Returns:
            True if valid, False otherwise
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
        """
        Abstract method for generating agent-specific responses
        
        Args:
            context: Context for generating response
            **kwargs: Additional parameters
            
        Returns:
            Agent-specific response dictionary
        """
        pass
    
    def get_model_info(self) -> Dict:
        """
        Get information about the model being used
        
        Returns:
            Dictionary with model information
        """
        return {
            "model_name": self.model_name,
            "provider": self.provider,
            "capabilities": ["text_generation", "json_response"],
            "rate_limit_delay": self._rate_limit_delay
        }
    
    def test_connection(self) -> bool:
        """
        Test the API connection
        
        Returns:
            True if connection works, False otherwise
        """
        try:
            test_prompt = "Respond with 'Connection successful' to test the API."
            response = self._generate_response(test_prompt)
            return "Connection successful" in response or "successful" in response.lower()
        except Exception as e:
            print(f"Connection test failed: {e}")
            return False


# Example usage
if __name__ == "__main__":
    # Test base agent
    class TestAgent(BaseAgent):
        def generate_response(self, context: str, **kwargs) -> dict:
            response = self._generate_response(
                prompt=context,
                system_prompt="You are a helpful assistant.",
                max_tokens=100
            )
            return {"response": response}
    
    # Note: This would require a real API key to test
    # agent = TestAgent(api_key="your_api_key_here")
    # result = agent.generate_response("Hello, how are you?")
    # print(result)
