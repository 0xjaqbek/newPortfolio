# RAG Temporal Query Inconsistency - Solution Design

## Problem Analysis

### The Issue
The RAG system gave inconsistent answers about Jakub's earliest repository:
- **First response**: Claimed "checker" (Oct 26, 2024) was the earliest
- **Second response**: Found "raffle" (Jan 17, 2024) - **9 months earlier**

### Root Causes

1. **Semantic Search Limitation**
   - ChromaDB uses cosine similarity for vector search, NOT chronological ordering
   - Query "what was the first repository" retrieves documents semantically similar to the question
   - Newer repositories with better descriptions may score higher than older ones

2. **Limited Context Window**
   - Current implementation: `n_results=3` per collection (rag_service.py:52)
   - Only retrieves top 3 semantically similar documents
   - Older repositories may not appear in top 3 if their descriptions are less relevant

3. **No Temporal Query Detection**
   - System treats all queries the same way
   - Doesn't recognize temporal keywords: "earliest", "first", "latest", "oldest", "newest"
   - No special handling for chronological questions

4. **No Metadata-Based Filtering**
   - ChromaDB supports `where` clause for metadata filtering (chroma_service.py:100)
   - GitHub repos have `created_at` and `first_commit` metadata (fetch_github_repos.py:283-284)
   - This metadata is stored but **never used for filtering**

## Solution Approaches

### Solution 1: Query Classification + Hybrid Search ⭐ **RECOMMENDED**

**Implementation**:
1. Add temporal keyword detection to RAG service
2. Route temporal queries through metadata-first search
3. Fall back to semantic search for non-temporal queries

**Changes Required**:

#### File: `python-rag-service/app/services/rag_service.py`

```python
import re
from datetime import datetime

class RAGService:
    # ... existing code ...

    def _detect_temporal_query(self, query: str) -> Optional[Dict[str, str]]:
        """
        Detect if query involves chronological/temporal aspects.

        Returns:
            Dict with 'type' (earliest/latest) and 'field' (created_at/last_commit)
            or None if not temporal
        """
        query_lower = query.lower()

        temporal_patterns = {
            'earliest': ['earliest', 'first', 'oldest', 'initial', 'when did you start'],
            'latest': ['latest', 'most recent', 'newest', 'last', 'current'],
        }

        for query_type, keywords in temporal_patterns.items():
            if any(keyword in query_lower for keyword in keywords):
                # Determine field based on context
                if 'commit' in query_lower or 'update' in query_lower:
                    field = 'last_commit' if query_type == 'latest' else 'first_commit'
                else:
                    field = 'created_at'

                return {
                    'type': query_type,
                    'field': field
                }

        return None

    async def chat(
        self,
        messages: List[Dict[str, str]],
        use_rag: bool = True,
        collections: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Process a chat request with optional RAG."""
        try:
            user_messages = [m for m in messages if m["role"] == "user"]
            last_user_message = user_messages[-1]["content"] if user_messages else ""

            context_parts = []
            metadata = {"sources": [], "rag_enabled": use_rag}

            if use_rag and last_user_message:
                # Detect temporal queries
                temporal_info = self._detect_temporal_query(last_user_message)

                search_collections = collections or list(self.chroma.collections.keys())

                for collection_name in search_collections:
                    # Use temporal search for GitHub repos if temporal query detected
                    if temporal_info and collection_name == "portfolio":
                        results = self._temporal_search(
                            collection_name=collection_name,
                            temporal_type=temporal_info['type'],
                            date_field=temporal_info['field'],
                            query_text=last_user_message,
                            n_results=10  # Get more results for temporal queries
                        )
                    else:
                        # Standard semantic search
                        results = self.chroma.query(
                            collection_name=collection_name,
                            query_text=last_user_message,
                            n_results=3,
                        )

                    # ... rest of existing code ...

    def _temporal_search(
        self,
        collection_name: str,
        temporal_type: str,
        date_field: str,
        query_text: str,
        n_results: int = 10
    ) -> Dict[str, Any]:
        """
        Perform temporal search by combining metadata filtering and sorting.

        Args:
            collection_name: Collection to search
            temporal_type: 'earliest' or 'latest'
            date_field: Metadata field to sort by (created_at, first_commit, last_commit)
            query_text: Original query for semantic filtering
            n_results: Number of results to return

        Returns:
            Query results sorted chronologically
        """
        # First, get all GitHub repositories
        # ChromaDB doesn't support ORDER BY, so we get many results and sort in Python
        results = self.chroma.query(
            collection_name=collection_name,
            query_text=query_text,
            n_results=50,  # Get more results to ensure we have all repos
            where={"type": "github_repo"}  # Filter only GitHub repos
        )

        if not results["documents"]:
            return results

        # Combine results with metadata for sorting
        combined = list(zip(
            results["documents"],
            results["metadatas"],
            results["distances"],
            results["ids"]
        ))

        # Sort by date field
        def get_sort_key(item):
            metadata = item[1]
            date_str = metadata.get(date_field, "")

            # Parse ISO date
            try:
                if date_str:
                    return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                else:
                    # Put items without dates at the end
                    return datetime.max if temporal_type == "earliest" else datetime.min
            except:
                return datetime.max if temporal_type == "earliest" else datetime.min

        combined.sort(key=get_sort_key, reverse=(temporal_type == "latest"))

        # Take top n_results after sorting
        combined = combined[:n_results]

        # Unzip back to separate lists
        if combined:
            docs, metas, dists, ids = zip(*combined)
            return {
                "documents": list(docs),
                "metadatas": list(metas),
                "distances": list(dists),
                "ids": list(ids)
            }
        else:
            return {"documents": [], "metadatas": [], "distances": [], "ids": []}
```

**Pros**:
- ✅ Solves the chronological inconsistency
- ✅ No database schema changes required
- ✅ Maintains semantic search for non-temporal queries
- ✅ Leverages existing metadata
- ✅ Easy to extend with more temporal patterns

**Cons**:
- ⚠️ Requires fetching more results (50) and sorting in Python
- ⚠️ Keyword-based detection may miss some temporal queries

---

### Solution 2: Two-Pass Retrieval System

**Implementation**:
1. First pass: Semantic search to find candidate documents
2. Second pass: Re-rank by chronological order if temporal query detected
3. Merge semantic relevance with temporal ordering

**Changes Required**:

#### File: `python-rag-service/app/services/rag_service.py`

```python
def _two_pass_retrieval(
    self,
    collection_name: str,
    query_text: str,
    temporal_weight: float = 0.7
) -> Dict[str, Any]:
    """
    Two-pass retrieval: semantic + temporal.

    Args:
        collection_name: Collection to search
        query_text: Query text
        temporal_weight: Weight for temporal score (0-1)

    Returns:
        Re-ranked results balancing semantic similarity and temporal relevance
    """
    # Pass 1: Semantic search
    semantic_results = self.chroma.query(
        collection_name=collection_name,
        query_text=query_text,
        n_results=20,
        where={"type": "github_repo"}
    )

    if not semantic_results["documents"]:
        return semantic_results

    # Pass 2: Calculate temporal scores
    combined = []
    for doc, meta, dist, doc_id in zip(
        semantic_results["documents"],
        semantic_results["metadatas"],
        semantic_results["distances"],
        semantic_results["ids"]
    ):
        semantic_score = 1 - dist  # Convert distance to similarity

        # Calculate temporal score (earlier = higher score)
        try:
            created_at = datetime.fromisoformat(
                meta.get("created_at", "").replace("Z", "+00:00")
            )
            # Normalize to 0-1 range (assume repos created between 2020-2025)
            days_since_2020 = (created_at - datetime(2020, 1, 1, tzinfo=created_at.tzinfo)).days
            temporal_score = 1 - (days_since_2020 / (365 * 10))  # Normalize to 10-year range
        except:
            temporal_score = 0.5  # Default for invalid dates

        # Combine scores
        final_score = (
            temporal_weight * temporal_score +
            (1 - temporal_weight) * semantic_score
        )

        combined.append({
            "doc": doc,
            "meta": meta,
            "dist": 1 - final_score,  # Convert back to distance
            "id": doc_id,
            "final_score": final_score
        })

    # Sort by final score
    combined.sort(key=lambda x: x["final_score"], reverse=True)

    # Return top results
    return {
        "documents": [x["doc"] for x in combined[:10]],
        "metadatas": [x["meta"] for x in combined[:10]],
        "distances": [x["dist"] for x in combined[:10]],
        "ids": [x["id"] for x in combined[:10]]
    }
```

**Pros**:
- ✅ Balances semantic relevance with temporal ordering
- ✅ More sophisticated than pure chronological sort
- ✅ Configurable weights

**Cons**:
- ⚠️ More complex implementation
- ⚠️ Requires date normalization assumptions
- ⚠️ May still return less relevant results if weights are wrong

---

### Solution 3: Dedicated Timeline API Endpoint

**Implementation**:
Add a separate endpoint specifically for chronological queries.

**Changes Required**:

#### File: `python-rag-service/app/api/timeline.py` (NEW)

```python
from fastapi import APIRouter
from app.services.chroma_service import chroma_service
from typing import List, Dict, Any
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/github/timeline")
async def get_github_timeline(
    order: str = "asc",  # asc = oldest first, desc = newest first
    limit: int = 20
) -> Dict[str, Any]:
    """
    Get GitHub repositories in chronological order.

    Args:
        order: "asc" for oldest first, "desc" for newest first
        limit: Maximum number of repos to return

    Returns:
        List of repositories sorted by creation date
    """
    try:
        # Get all portfolio documents
        collection = chroma_service.collections["portfolio"]

        # Get all documents (ChromaDB doesn't have get_all, so we query with high limit)
        results = collection.get(
            where={"type": "github_repo"},
            limit=1000  # Assuming < 1000 repos
        )

        # Combine and sort
        repos = []
        for doc, meta, doc_id in zip(
            results.get("documents", []),
            results.get("metadatas", []),
            results.get("ids", [])
        ):
            try:
                created_at = datetime.fromisoformat(
                    meta.get("created_at", "").replace("Z", "+00:00")
                )
                repos.append({
                    "id": doc_id,
                    "name": meta.get("repo_name"),
                    "created_at": meta.get("created_at"),
                    "created_date": created_at.strftime("%Y-%m-%d"),
                    "url": meta.get("url"),
                    "description": doc[:200] + "..." if len(doc) > 200 else doc,
                    "languages": meta.get("languages"),
                    "stars": meta.get("stars", 0)
                })
            except Exception as e:
                logger.warning(f"Skipping repo due to date parse error: {e}")
                continue

        # Sort by date
        repos.sort(
            key=lambda x: datetime.fromisoformat(x["created_at"].replace("Z", "+00:00")),
            reverse=(order == "desc")
        )

        return {
            "total": len(repos),
            "order": order,
            "repositories": repos[:limit]
        }

    except Exception as e:
        logger.error(f"Error getting timeline: {e}")
        return {
            "error": str(e),
            "repositories": []
        }


@router.get("/github/earliest")
async def get_earliest_repo() -> Dict[str, Any]:
    """Get the earliest GitHub repository."""
    timeline = await get_github_timeline(order="asc", limit=1)
    if timeline["repositories"]:
        return {
            "repository": timeline["repositories"][0],
            "message": "This is Jakub's earliest GitHub repository based on creation date."
        }
    return {"error": "No repositories found"}


@router.get("/github/latest")
async def get_latest_repo() -> Dict[str, Any]:
    """Get the most recent GitHub repository."""
    timeline = await get_github_timeline(order="desc", limit=1)
    if timeline["repositories"]:
        return {
            "repository": timeline["repositories"][0],
            "message": "This is Jakub's most recent GitHub repository based on creation date."
        }
    return {"error": "No repositories found"}
```

**Register in main app**:

#### File: `python-rag-service/app/main.py`

```python
from app.api import health, chat, timeline

# ... existing code ...

# Include routers
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["timeline"])  # NEW
```

**Pros**:
- ✅ Dedicated, reliable endpoint for chronological queries
- ✅ Can be called directly by frontend for timeline visualization
- ✅ No guessing about query intent
- ✅ Easy to test and validate

**Cons**:
- ⚠️ Doesn't fix the chat inconsistency issue
- ⚠️ Requires frontend integration
- ⚠️ Separate API instead of unified chat interface

---

### Solution 4: Enhanced Document Content (Preventive)

**Implementation**:
Improve how GitHub repositories are embedded to emphasize chronological information.

**Changes Required**:

#### File: `python-rag-service/scripts/fetch_github_repos.py`

```python
# Line 236 - Update document content
doc_content = f"""
Jakub Skwierawski - GitHub Repository: {repo_name}

CHRONOLOGICAL INFORMATION:
- Repository Creation Date: {created_at} ({created_at_human})
- This repository was created on {created_at_human}
- Chronological Order: {"One of the earliest repositories" if is_early else "Recent repository"}
- First Commit: {first_commit_formatted}
- Last Commit: {last_commit_formatted}
- Last Updated: {updated_at}

Repository Name: {repo_name}
Full Name: {repo.get("full_name", "")}
Description: {repo.get("description", "No description")}
URL: {repo.get("html_url", "")}

Languages: {", ".join(language_list) if language_list else "Not specified"}
Topics/Tags: {", ".join(repo.get("topics", [])) if repo.get("topics") else "None"}

Statistics:
- Stars: {repo.get("stargazers_count", 0)}
- Forks: {repo.get("forks_count", 0)}
- Watchers: {repo.get("watchers_count", 0)}
- Open Issues: {repo.get("open_issues_count", 0)}

Status:
- Private: {repo.get("private", False)}
- Fork: {repo.get("fork", False)}
- Archived: {repo.get("archived", False)}
"""
```

**Also add**:
```python
# Calculate human-readable date
try:
    created_dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    created_at_human = created_dt.strftime("%B %d, %Y")

    # Determine if early repository (before 2024)
    is_early = created_dt.year < 2024
except:
    created_at_human = created_at
    is_early = False
```

**Pros**:
- ✅ Improves semantic search for temporal queries
- ✅ Emphasizes chronological information in embeddings
- ✅ No runtime changes needed

**Cons**:
- ⚠️ Still relies on semantic similarity
- ⚠️ No guarantee that semantic search will prioritize dates
- ⚠️ Requires re-embedding all documents

---

## Recommended Implementation Plan

### Phase 1: Quick Win (1-2 hours)
✅ **Implement Solution 1** (Query Classification + Hybrid Search)
- Add `_detect_temporal_query()` method
- Add `_temporal_search()` method
- Update `chat()` method to route temporal queries
- Test with queries: "earliest repository", "first repo", "latest project"

### Phase 2: API Enhancement (2-3 hours)
✅ **Implement Solution 3** (Timeline API)
- Create `/api/timeline/github/timeline` endpoint
- Create `/api/timeline/github/earliest` endpoint
- Create `/api/timeline/github/latest` endpoint
- Add frontend integration for timeline visualization

### Phase 3: Content Enhancement (1 hour)
✅ **Implement Solution 4** (Enhanced Content)
- Update `fetch_github_repos.py` to emphasize dates
- Re-run embedding script
- Verify improved semantic search

### Phase 4: Advanced (Optional, 4-6 hours)
⚠️ **Implement Solution 2** (Two-Pass Retrieval)
- Only if Solution 1 doesn't provide satisfactory results
- Requires more testing and tuning

---

## Testing Plan

### Test Queries
1. "What was Jakub's first GitHub repository?"
2. "Show me the earliest repository"
3. "What's the most recent project?"
4. "List repositories in chronological order"
5. "Which repository has the earliest commit?"
6. "When did you start coding?"

### Expected Results
- All queries should consistently identify "raffle" (Jan 17, 2024) as earliest
- Timeline should be accurate across multiple queries
- Non-temporal queries should still work with semantic search

### Validation
```bash
# Test temporal query detection
curl -X POST https://newportfolio-production-8823.up.railway.app/api/chat/rag \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What was Jakub'\''s first GitHub repository?"}
    ]
  }'

# Test timeline API
curl https://newportfolio-production-8823.up.railway.app/api/timeline/github/earliest
curl https://newportfolio-production-8823.up.railway.app/api/timeline/github/timeline?order=asc&limit=10
```

---

## Conclusion

The **recommended solution** is a combination of:
1. **Solution 1** (Temporal query detection) for chat consistency
2. **Solution 3** (Timeline API) for guaranteed accuracy
3. **Solution 4** (Enhanced content) for long-term improvement

This provides both immediate fixes and long-term robustness without over-engineering the system.

**Estimated Total Implementation Time**: 4-6 hours

**Priority**: Medium-High (affects accuracy and user trust in RAG responses)
