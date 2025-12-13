from fastapi import APIRouter, HTTPException
from app.models.schemas import SearchRequest, SearchResponse
from app.services.rag_service import rag_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=SearchResponse)
async def search_documents(request: SearchRequest):
    """
    Search for similar documents in a collection.

    Uses semantic similarity to find relevant documents.
    """
    try:
        results = await rag_service.search_similar(
            query=request.query,
            collection_name=request.collection,
            n_results=request.n_results,
        )

        return SearchResponse(results=results)

    except Exception as e:
        logger.error(f"Error in search endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
