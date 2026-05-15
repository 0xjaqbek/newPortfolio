from fastapi import APIRouter, HTTPException, Header
from app.core.config import settings
import logging
import asyncio
import os
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)
router = APIRouter()

_reembed_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="reembed")
_reembed_running = False


def _run_reembed():
    global _reembed_running
    try:
        import sys
        app_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if app_root not in sys.path:
            sys.path.insert(0, app_root)

        from scripts.embed_initial_data import embed_portfolio_data, embed_documentation
        logger.info("[reembed] Embedding portfolio and documentation...")
        embed_portfolio_data()
        embed_documentation()

        github_token = settings.GITHUB_TOKEN or os.getenv("GITHUB_TOKEN")
        if github_token:
            logger.info("[reembed] Fetching and embedding GitHub repositories...")
            from scripts.fetch_github_repos import embed_github_repos
            embed_github_repos(github_token)
            logger.info("[reembed] GitHub repositories done.")
        else:
            logger.warning("[reembed] GITHUB_TOKEN not set — skipping GitHub repos.")

        logger.info("[reembed] Re-embedding complete.")
    except Exception as e:
        logger.error(f"[reembed] Failed: {e}", exc_info=True)
    finally:
        _reembed_running = False


@router.post("/reembed")
async def trigger_reembed(x_admin_token: str = Header(...)):
    """Trigger re-embedding of all portfolio data and GitHub repositories."""
    global _reembed_running

    admin_token = os.getenv("ADMIN_TOKEN")
    if not admin_token or x_admin_token != admin_token:
        raise HTTPException(status_code=401, detail="Invalid admin token")

    if _reembed_running:
        return {"status": "already_running", "message": "Re-embedding is already in progress"}

    _reembed_running = True
    loop = asyncio.get_event_loop()
    loop.run_in_executor(_reembed_executor, _run_reembed)

    return {"status": "started", "message": "Re-embedding started in background. Check service logs for progress."}


@router.get("/status")
async def reembed_status(x_admin_token: str = Header(...)):
    """Check if re-embedding is currently running."""
    admin_token = os.getenv("ADMIN_TOKEN")
    if not admin_token or x_admin_token != admin_token:
        raise HTTPException(status_code=401, detail="Invalid admin token")

    from app.services.chroma_service import chroma_service
    stats = chroma_service.get_stats()

    return {
        "reembed_running": _reembed_running,
        "collections": stats,
    }
