from fastapi import APIRouter, BackgroundTasks
from app.services.rag_service import rag_service
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "RAG Assistant"}


@router.get("/stats")
async def get_stats():
    """Get system statistics."""
    stats = rag_service.get_statistics()
    return stats


@router.post("/embed-initial-data")
async def embed_initial_data(background_tasks: BackgroundTasks):
    """Trigger initial data embedding (run in background)."""
    def run_embedding():
        try:
            logger.info("Starting background embedding task...")
            import sys
            sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

            # Import and run the embedding script functions
            from scripts.embed_initial_data import embed_portfolio_data, embed_documentation, embed_security_logs
            from scripts.fetch_github_repos import embed_github_repos

            logger.info("Embedding portfolio data...")
            embed_portfolio_data()

            logger.info("Embedding documentation...")
            embed_documentation()

            logger.info("Embedding security logs...")
            embed_security_logs()

            # Embed GitHub repos
            github_token = os.getenv("GITHUB_TOKEN")
            if github_token:
                logger.info("Embedding GitHub repositories...")
                embed_github_repos(github_token)
            else:
                logger.warning("GITHUB_TOKEN not found, skipping GitHub repos")

            logger.info("Background embedding complete!")

        except Exception as e:
            logger.error(f"Error in background embedding: {e}")

    background_tasks.add_task(run_embedding)
    return {
        "status": "embedding_started",
        "message": "Initial data embedding started in background. Check /api/health/stats in a few minutes."
    }


@router.delete("/github-embeddings")
async def delete_github_embeddings():
    """Delete all GitHub repository embeddings from portfolio collection."""
    try:
        from app.services.chroma_service import chroma_service

        collection = chroma_service.collections.get("portfolio")
        if not collection:
            return {"error": "Portfolio collection not found"}

        # Get all GitHub repo IDs
        results = collection.get(
            where={"type": "github_repo"},
            limit=1000
        )

        if not results or not results.get("ids"):
            return {
                "status": "no_github_repos",
                "message": "No GitHub repositories found in portfolio collection",
                "deleted_count": 0
            }

        github_ids = results["ids"]
        logger.info(f"Found {len(github_ids)} GitHub repositories to delete")

        # Delete all GitHub repos
        collection.delete(ids=github_ids)

        logger.info(f"Deleted {len(github_ids)} GitHub repositories from portfolio collection")

        return {
            "status": "success",
            "message": f"Deleted {len(github_ids)} GitHub repositories from portfolio collection",
            "deleted_count": len(github_ids),
            "deleted_ids": github_ids
        }

    except Exception as e:
        logger.error(f"Error deleting GitHub embeddings: {e}")
        return {
            "status": "error",
            "error": str(e)
        }


@router.post("/embed-github-repos")
async def embed_github_repos_endpoint(background_tasks: BackgroundTasks):
    """Trigger GitHub repository embedding (run in background)."""
    def run_github_embedding():
        try:
            logger.info("Starting GitHub repository embedding...")
            import sys
            sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

            from scripts.fetch_github_repos import embed_github_repos

            github_token = os.getenv("GITHUB_TOKEN")
            if not github_token:
                logger.error("GITHUB_TOKEN not found")
                return

            logger.info("Embedding GitHub repositories...")
            embed_github_repos(github_token)
            logger.info("GitHub repository embedding complete!")

        except Exception as e:
            logger.error(f"Error in GitHub embedding: {e}")

    background_tasks.add_task(run_github_embedding)
    return {
        "status": "embedding_started",
        "message": "GitHub repository embedding started in background. Check /api/health/stats in a few minutes."
    }
