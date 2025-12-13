from fastapi import APIRouter, HTTPException
from app.services.rag_service import rag_service
from app.services.database_service import db_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/analyze")
async def analyze_security_patterns():
    """
    Analyze security attack patterns using RAG.

    Provides:
    - Attack trend analysis
    - Common attack types
    - Severity distribution
    - Mitigation recommendations
    """
    try:
        analysis = await rag_service.analyze_security_patterns()
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing security patterns: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs")
async def get_security_logs(limit: int = 100):
    """Get recent security logs from database."""
    try:
        logs = db_service.get_security_logs(limit=limit)
        return {"logs": logs, "count": len(logs)}
    except Exception as e:
        logger.error(f"Error fetching security logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/patterns")
async def get_attack_patterns():
    """Get aggregated attack patterns."""
    try:
        patterns = db_service.get_attack_patterns()
        return {"patterns": patterns, "count": len(patterns)}
    except Exception as e:
        logger.error(f"Error fetching attack patterns: {e}")
        raise HTTPException(status_code=500, detail=str(e))
