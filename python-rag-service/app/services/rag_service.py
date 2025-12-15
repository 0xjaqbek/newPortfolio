from typing import List, Dict, Any, Optional
from app.services.chroma_service import chroma_service
from app.services.deepseek_service import deepseek_service
from app.services.database_service import db_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class RAGService:
    """Service for Retrieval-Augmented Generation."""

    def __init__(self):
        self.chroma = chroma_service
        self.deepseek = deepseek_service
        self.db = db_service

    def _detect_temporal_query(self, query: str) -> Optional[Dict[str, str]]:
        """
        Detect if query involves chronological/temporal aspects.

        Args:
            query: User query text

        Returns:
            Dict with 'type' (earliest/latest) and 'field' (created_at/first_commit/last_commit)
            or None if not temporal
        """
        query_lower = query.lower()

        temporal_patterns = {
            'earliest': ['earliest', 'first', 'oldest', 'initial', 'when did you start', 'beginning'],
            'latest': ['latest', 'most recent', 'newest', 'last', 'current', 'recent'],
        }

        for query_type, keywords in temporal_patterns.items():
            if any(keyword in query_lower for keyword in keywords):
                # Determine field based on context
                if 'commit' in query_lower or 'update' in query_lower:
                    field = 'last_commit' if query_type == 'latest' else 'first_commit'
                else:
                    field = 'created_at'

                logger.info(f"Detected temporal query: type={query_type}, field={field}")
                return {
                    'type': query_type,
                    'field': field
                }

        return None

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
        try:
            # Get GitHub repositories with higher limit
            results = self.chroma.query(
                collection_name=collection_name,
                query_text=query_text,
                n_results=50,  # Get more results to ensure we have all relevant repos
                where={"type": "github_repo"}  # Filter only GitHub repos
            )

            if not results["documents"]:
                logger.info("No GitHub repos found in temporal search")
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
                except Exception as e:
                    logger.warning(f"Error parsing date {date_str}: {e}")
                    return datetime.max if temporal_type == "earliest" else datetime.min

            combined.sort(key=get_sort_key, reverse=(temporal_type == "latest"))

            logger.info(f"Temporal search sorted {len(combined)} repos by {date_field}, order={temporal_type}")

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

        except Exception as e:
            logger.error(f"Error in temporal search: {e}")
            # Fall back to regular search
            return self.chroma.query(
                collection_name=collection_name,
                query_text=query_text,
                n_results=n_results,
            )

    async def chat(
        self,
        messages: List[Dict[str, str]],
        use_rag: bool = True,
        collections: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Process a chat request with optional RAG.

        Args:
            messages: List of chat messages
            use_rag: Whether to use RAG for context retrieval
            collections: List of collections to search (default: all)

        Returns:
            Dict with response and context metadata
        """
        try:
            # Get the last user message for context retrieval
            user_messages = [m for m in messages if m["role"] == "user"]
            last_user_message = user_messages[-1]["content"] if user_messages else ""

            context_parts = []
            metadata = {"sources": [], "rag_enabled": use_rag}

            if use_rag and last_user_message:
                # Detect temporal queries
                temporal_info = self._detect_temporal_query(last_user_message)

                # Determine which collections to search
                search_collections = collections or list(self.chroma.collections.keys())

                # Search each collection for relevant context
                for collection_name in search_collections:
                    # Use temporal search for portfolio collection if temporal query detected
                    if temporal_info and collection_name == "portfolio":
                        logger.info(f"Using temporal search for {collection_name}")
                        results = self._temporal_search(
                            collection_name=collection_name,
                            temporal_type=temporal_info['type'],
                            date_field=temporal_info['field'],
                            query_text=last_user_message,
                            n_results=10  # Get more results for temporal queries
                        )
                        metadata["temporal_query"] = True
                        metadata["temporal_type"] = temporal_info['type']
                        metadata["temporal_field"] = temporal_info['field']
                    else:
                        # Standard semantic search
                        results = self.chroma.query(
                            collection_name=collection_name,
                            query_text=last_user_message,
                            n_results=3,
                        )

                    if results["documents"]:
                        context_parts.append(f"\n### Context from {collection_name}:")
                        for i, (doc, meta, distance) in enumerate(
                            zip(
                                results["documents"],
                                results["metadatas"],
                                results["distances"],
                            )
                        ):
                            # Only include relevant results (distance < 0.7)
                            if distance < 0.7:
                                context_parts.append(f"\n{doc}")
                                metadata["sources"].append({
                                    "collection": collection_name,
                                    "metadata": meta,
                                    "relevance": 1 - distance,
                                })

            # Build system prompt with context
            system_prompt = self._build_system_prompt(context_parts)

            # Get response from DeepSeek
            response = await self.deepseek.chat_completion(
                messages=messages,
                system_prompt=system_prompt,
            )

            return {
                "response": response,
                "metadata": metadata,
            }

        except Exception as e:
            logger.error(f"Error in RAG chat: {e}")
            return {
                "response": "Sorry, I encountered an error processing your request.",
                "metadata": {"error": str(e)},
            }

    def _build_system_prompt(self, context_parts: List[str]) -> str:
        """Build system prompt with retrieved context."""
        base_prompt = """You are an AI assistant for Jakub Skwierawski's portfolio website with RAG (Retrieval-Augmented Generation) capabilities.

## YOUR ROLE
- Answer questions about Jakub Skwierawski's skills, experience, and projects
- Discuss potential project ideas and collaborations that align with his expertise
- Provide insights into his technical background and capabilities using retrieved context
- Analyze security patterns and attack logs when relevant
- Stay focused on portfolio and work-related topics
- Be professional yet conversational and helpful

## RAG CAPABILITIES
You have access to a comprehensive knowledge base including:
- Portfolio and project information (Protokół 999, 34us ETH Warsaw, Interactive Portfolio)
- GitHub repositories with commit timelines, languages, topics, and READMEs
- Technical skills and work experience
- Documentation and knowledge base
- Security attack logs and patterns for analysis
- Chat history and custom documents

## BEHAVIOR GUIDELINES
1. **Use Retrieved Context**: Prioritize information from the retrieved context over general knowledge
2. **Be Specific**: Reference actual projects, skills, and experiences from the knowledge base
3. **Don't Mix Projects**: Each project is separate - don't combine features from different projects
   - Protokół 999 = Medical emergency training platform (NOT cybersecurity)
   - Interactive Portfolio = This portfolio website with Guardian Security (chatbot security, NOT medical)
   - 34us = Web3 mentorship platform from ETH Warsaw hackathon
4. **Security Insights**: When discussing security, leverage the attack logs and patterns
5. **Be Honest**: If the context doesn't contain relevant information, acknowledge it clearly
6. **Show Expertise**: Demonstrate deep knowledge of the technologies and projects mentioned
7. **Stay On Topic**: Keep discussions focused on Jakub's work and capabilities

Remember: You represent Jakub Skwierawski professionally using enhanced context from semantic search. DO NOT confuse or mix different projects together.
"""

        if context_parts:
            context_str = "\n".join(context_parts)
            return f"{base_prompt}\n\n## Retrieved Context:\n{context_str}\n\n---\n\nPlease answer the user's question based on the above context when relevant."
        else:
            return base_prompt

    async def search_similar(
        self, query: str, collection_name: str, n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """Search for similar documents in a specific collection."""
        try:
            results = self.chroma.query(
                collection_name=collection_name,
                query_text=query,
                n_results=n_results,
            )

            similar_docs = []
            for doc, meta, distance, doc_id in zip(
                results["documents"],
                results["metadatas"],
                results["distances"],
                results["ids"],
            ):
                similar_docs.append({
                    "id": doc_id,
                    "content": doc,
                    "metadata": meta,
                    "similarity": 1 - distance,
                })

            return similar_docs
        except Exception as e:
            logger.error(f"Error searching similar documents: {e}")
            return []

    async def analyze_security_patterns(self) -> Dict[str, Any]:
        """Analyze security attack patterns from database."""
        try:
            # Get attack patterns from database
            patterns = self.db.get_attack_patterns()

            if not patterns:
                return {
                    "summary": "No security patterns found.",
                    "patterns": [],
                }

            # Get recent security logs
            recent_logs = self.db.get_security_logs(limit=100)

            # Search for similar attacks in vector DB
            if recent_logs:
                latest_attack = recent_logs[0]
                attack_description = f"{latest_attack['activityType']} - {latest_attack['severity']}"

                similar_attacks = await self.search_similar(
                    query=attack_description,
                    collection_name="security_logs",
                    n_results=5,
                )
            else:
                similar_attacks = []

            # Use DeepSeek to analyze patterns
            analysis_prompt = f"""Analyze these security attack patterns and provide insights:

Attack Statistics:
{patterns}

Recent Attacks:
{recent_logs[:10]}

Similar Historical Attacks:
{similar_attacks}

Please provide:
1. Summary of attack trends
2. Most common attack types
3. Severity distribution
4. Recommendations for mitigation
"""

            messages = [{"role": "user", "content": analysis_prompt}]
            analysis = await self.deepseek.chat_completion(messages)

            return {
                "summary": analysis,
                "patterns": patterns,
                "recent_attacks": recent_logs[:10],
                "similar_attacks": similar_attacks,
            }

        except Exception as e:
            logger.error(f"Error analyzing security patterns: {e}")
            return {
                "summary": "Error analyzing security patterns.",
                "error": str(e),
            }

    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the RAG system."""
        return {
            "collections": self.chroma.get_stats(),
            "embedding_model": self.chroma.embedding_model.get_sentence_embedding_dimension(),
        }


# Singleton instance
rag_service = RAGService()
