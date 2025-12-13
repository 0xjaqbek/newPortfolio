import os
# Disable default embedding function to avoid onnxruntime DLL issues on Windows
os.environ["ANONYMIZED_TELEMETRY"] = "False"

import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class ChromaService:
    """Service for managing ChromaDB vector store."""

    def __init__(self):
        # Ensure persist directory exists
        os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)

        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=ChromaSettings(anonymized_telemetry=False),
        )

        # Initialize embedding model
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)

        # Create or get collections
        self.collections = {
            "portfolio": self._get_or_create_collection("portfolio"),
            "documentation": self._get_or_create_collection("documentation"),
            "security_logs": self._get_or_create_collection("security_logs"),
            "chat_history": self._get_or_create_collection("chat_history"),
            "custom_docs": self._get_or_create_collection("custom_docs"),
        }

        logger.info("ChromaDB initialized successfully")

    def _get_or_create_collection(self, name: str):
        """Get or create a collection."""
        try:
            return self.client.get_or_create_collection(
                name=name,
                metadata={"hnsw:space": "cosine"},
                embedding_function=None  # We'll handle embeddings manually
            )
        except Exception as e:
            logger.error(f"Error creating collection {name}: {e}")
            raise

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for text."""
        embedding = self.embedding_model.encode(text, convert_to_numpy=True)
        return embedding.tolist()

    def add_documents(
        self,
        collection_name: str,
        documents: List[str],
        metadatas: List[Dict[str, Any]],
        ids: Optional[List[str]] = None,
    ) -> bool:
        """Add documents to a collection."""
        try:
            collection = self.collections.get(collection_name)
            if not collection:
                logger.error(f"Collection {collection_name} not found")
                return False

            # Generate embeddings
            embeddings = [self.embed_text(doc) for doc in documents]

            # Generate IDs if not provided
            if ids is None:
                import uuid
                ids = [str(uuid.uuid4()) for _ in documents]

            # Add to collection
            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids,
            )

            logger.info(f"Added {len(documents)} documents to {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Error adding documents to {collection_name}: {e}")
            return False

    def query(
        self,
        collection_name: str,
        query_text: str,
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Query a collection for similar documents."""
        try:
            collection = self.collections.get(collection_name)
            if not collection:
                logger.error(f"Collection {collection_name} not found")
                return {"documents": [], "metadatas": [], "distances": []}

            # Generate query embedding
            query_embedding = self.embed_text(query_text)

            # Query collection
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where,
            )

            return {
                "documents": results["documents"][0] if results["documents"] else [],
                "metadatas": results["metadatas"][0] if results["metadatas"] else [],
                "distances": results["distances"][0] if results["distances"] else [],
                "ids": results["ids"][0] if results["ids"] else [],
            }
        except Exception as e:
            logger.error(f"Error querying {collection_name}: {e}")
            return {"documents": [], "metadatas": [], "distances": []}

    def search_all_collections(
        self, query_text: str, n_results: int = 3
    ) -> Dict[str, Any]:
        """Search across all collections."""
        results = {}
        for collection_name in self.collections.keys():
            results[collection_name] = self.query(
                collection_name, query_text, n_results
            )
        return results

    def get_collection_count(self, collection_name: str) -> int:
        """Get the number of documents in a collection."""
        try:
            collection = self.collections.get(collection_name)
            if not collection:
                return 0
            return collection.count()
        except Exception as e:
            logger.error(f"Error getting count for {collection_name}: {e}")
            return 0

    def delete_collection(self, collection_name: str) -> bool:
        """Delete a collection."""
        try:
            self.client.delete_collection(collection_name)
            if collection_name in self.collections:
                del self.collections[collection_name]
            logger.info(f"Deleted collection {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Error deleting collection {collection_name}: {e}")
            return False

    def get_stats(self) -> Dict[str, int]:
        """Get statistics for all collections."""
        stats = {}
        for name in self.collections.keys():
            stats[name] = self.get_collection_count(name)
        return stats


# Singleton instance
chroma_service = ChromaService()
