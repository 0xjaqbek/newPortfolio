from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router
import logging
import asyncio
import os
import sys
from concurrent.futures import ThreadPoolExecutor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

# Thread pool for running synchronous embedding tasks
_embed_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="embed")

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


def _run_initial_embedding():
    """Run initial data embedding synchronously in a background thread."""
    try:
        # Ensure /app (project root) is on sys.path so script imports resolve
        app_root = os.path.dirname(os.path.abspath(__file__))
        if app_root not in sys.path:
            sys.path.insert(0, app_root)

        logger.info("[embed] Embedding portfolio and documentation...")
        from scripts.embed_initial_data import embed_portfolio_data, embed_documentation
        embed_portfolio_data()
        embed_documentation()
        logger.info("[embed] Portfolio and documentation done.")

        github_token = settings.GITHUB_TOKEN or os.getenv("GITHUB_TOKEN")
        if github_token:
            logger.info("[embed] Fetching and embedding GitHub repositories...")
            from scripts.fetch_github_repos import embed_github_repos
            embed_github_repos(github_token)
            logger.info("[embed] GitHub repositories done.")
        else:
            logger.warning("[embed] GITHUB_TOKEN not set — skipping GitHub repos.")

        logger.info("[embed] Initial embedding complete.")
    except Exception as e:
        logger.error(f"[embed] Initial embedding failed: {e}", exc_info=True)


@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info("Starting RAG Assistant API...")
    logger.info(f"CORS origins: {settings.cors_origins_list}")
    logger.info(f"ChromaDB persist dir: {settings.CHROMA_PERSIST_DIR}")

    from app.services.chroma_service import chroma_service
    portfolio_count = chroma_service.get_collection_count("portfolio")

    if portfolio_count == 0:
        logger.info(
            "Portfolio collection is empty — starting background embedding. "
            "RAG responses will be limited until embedding completes (~1-2 min)."
        )
        loop = asyncio.get_event_loop()
        loop.run_in_executor(_embed_executor, _run_initial_embedding)
    else:
        logger.info(f"Collections already populated (portfolio: {portfolio_count} docs) — skipping embedding.")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info("Shutting down RAG Assistant API...")
    _embed_executor.shutdown(wait=False)
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

    # Use Railway's PORT environment variable if available, otherwise use settings
    port = int(os.getenv("PORT", str(settings.API_PORT)))

    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=port,
        reload=False,  # Disable reload in production
    )
