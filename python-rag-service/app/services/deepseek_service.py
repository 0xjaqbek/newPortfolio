import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class DeepSeekService:
    """Service for interacting with DeepSeek API."""

    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_BASE_URL
        self.model = settings.DEEPSEEK_MODEL
        self.client = httpx.AsyncClient(timeout=60.0)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> str:
        """Send a chat completion request to DeepSeek API."""
        try:
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
            logger.error(f"DeepSeek API error: {e.response.status_code} - {e.response.text}")
            return f"API error: {e.response.status_code}"
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {e}")
            return "Sorry, I encountered an error while processing your request."

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


# Singleton instance
deepseek_service = DeepSeekService()
