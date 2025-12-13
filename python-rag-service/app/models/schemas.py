from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class ChatMessage(BaseModel):
    role: str = Field(..., description="Message role: user or assistant")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="List of chat messages")
    use_rag: bool = Field(default=True, description="Enable RAG for context retrieval")
    collections: Optional[List[str]] = Field(
        default=None, description="Collections to search (default: all)"
    )


class ChatResponse(BaseModel):
    response: str = Field(..., description="AI-generated response")
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Metadata about sources and context"
    )


class DocumentUpload(BaseModel):
    content: str = Field(..., description="Document content to embed")
    collection: str = Field(..., description="Collection to add document to")
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Document metadata"
    )


class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query")
    collection: str = Field(..., description="Collection to search")
    n_results: int = Field(default=10, description="Number of results to return")


class SearchResponse(BaseModel):
    results: List[Dict[str, Any]] = Field(
        default_factory=list, description="Search results"
    )


class StatsResponse(BaseModel):
    collections: Dict[str, int] = Field(
        default_factory=dict, description="Document counts per collection"
    )
    embedding_dimension: int = Field(..., description="Embedding vector dimension")
