from fastapi import APIRouter
from app.services.rag_service import rag_service

router = APIRouter()


@router.get("/")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "RAG Assistant"}


@router.get("/stats")
async def get_stats():
    """Get system statistics."""
    stats = rag_service.get_statistics()
    return stats
