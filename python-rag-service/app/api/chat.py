from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_service import rag_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint with RAG support.

    Supports:
    - Semantic search across all knowledge collections
    - Context-aware responses using DeepSeek
    - Metadata about retrieved sources
    """
    try:
        # Convert Pydantic models to dicts
        messages = [msg.model_dump() for msg in request.messages]

        # Get response from RAG service
        result = await rag_service.chat(
            messages=messages,
            use_rag=request.use_rag,
            collections=request.collections,
        )

        return ChatResponse(
            response=result["response"],
            metadata=result["metadata"],
        )

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
