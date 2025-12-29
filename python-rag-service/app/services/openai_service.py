import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for interacting with OpenAI API."""

    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.base_url = settings.OPENAI_BASE_URL
        self.model = settings.OPENAI_MODEL
        self.client = httpx.AsyncClient(timeout=60.0)

        if not self.api_key:
            logger.warning("OPENAI_API_KEY not set! OpenAI service will not work until the environment variable is configured.")

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> str:
        """Send a chat completion request to OpenAI API."""
        try:
            # Check if API key is configured
            if not self.api_key:
                logger.error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
                return "OpenAI service is not configured. Please contact the administrator to set up the API key."

            # Prepare messages
            formatted_messages = []

            if system_prompt:
                formatted_messages.append({
                    "role": "system",
                    "content": system_prompt,
                })

            formatted_messages.extend(messages)

            # Make API request
            response = await self.client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": formatted_messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )

            response.raise_for_status()
            data = response.json()

            # Extract response
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"]
            else:
                logger.error(f"Unexpected API response format: {data}")
                return "Sorry, I couldn't generate a response."

        except httpx.HTTPStatusError as e:
            logger.error(f"OpenAI API error: {e.response.status_code} - {e.response.text}")
            return f"API error: {e.response.status_code}"
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {e}")
            return "Sorry, I encountered an error while processing your request."

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


# Singleton instance
openai_service = OpenAIService()
