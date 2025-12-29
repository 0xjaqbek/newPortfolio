from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="RAG Assistant API",
    description="Retrieval-Augmented Generation chatbot with vector database",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info("Starting RAG Assistant API...")
    logger.info(f"CORS origins: {settings.cors_origins_list}")
    logger.info(f"ChromaDB persist dir: {settings.CHROMA_PERSIST_DIR}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info("Shutting down RAG Assistant API...")
    from app.services.openai_service import openai_service
    from app.services.database_service import db_service

    await openai_service.close()
    db_service.close()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "RAG Assistant API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    import os

    # Use Railway's PORT environment variable if available, otherwise use settings
    port = int(os.getenv("PORT", str(settings.API_PORT)))

    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=port,
        reload=False,  # Disable reload in production
    )
