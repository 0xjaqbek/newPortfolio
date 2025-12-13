from fastapi import APIRouter
from .chat import router as chat_router
from .documents import router as documents_router
from .search import router as search_router
from .security import router as security_router
from .health import router as health_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(chat_router, prefix="/chat", tags=["chat"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(search_router, prefix="/search", tags=["search"])
api_router.include_router(security_router, prefix="/security", tags=["security"])

__all__ = ["api_router"]
