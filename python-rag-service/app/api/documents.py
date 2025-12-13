from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.schemas import DocumentUpload
from app.services.chroma_service import chroma_service
from typing import Optional
import logging
import uuid

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    collection: str = Form(...),
    metadata: Optional[str] = Form(None),
):
    """
    Upload and embed a document.

    Supports: .txt, .md, .json, .pdf
    """
    try:
        # Read file content
        content = await file.read()
        text_content = content.decode("utf-8")

        # Parse metadata if provided
        import json
        meta = json.loads(metadata) if metadata else {}
        meta["filename"] = file.filename
        meta["content_type"] = file.content_type

        # Add to ChromaDB
        doc_id = str(uuid.uuid4())
        success = chroma_service.add_documents(
            collection_name=collection,
            documents=[text_content],
            metadatas=[meta],
            ids=[doc_id],
        )

        if success:
            return {
                "message": "Document uploaded successfully",
                "document_id": doc_id,
                "collection": collection,
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to upload document")

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400, detail="File must be text-based (UTF-8 encoded)"
        )
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/embed")
async def embed_text(doc: DocumentUpload):
    """
    Embed raw text content into a collection.
    """
    try:
        doc_id = str(uuid.uuid4())
        success = chroma_service.add_documents(
            collection_name=doc.collection,
            documents=[doc.content],
            metadatas=[doc.metadata],
            ids=[doc_id],
        )

        if success:
            return {
                "message": "Document embedded successfully",
                "document_id": doc_id,
                "collection": doc.collection,
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to embed document")

    except Exception as e:
        logger.error(f"Error embedding document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/collections")
async def list_collections():
    """List all available collections and their document counts."""
    try:
        stats = chroma_service.get_stats()
        return {"collections": stats}
    except Exception as e:
        logger.error(f"Error listing collections: {e}")
        raise HTTPException(status_code=500, detail=str(e))
