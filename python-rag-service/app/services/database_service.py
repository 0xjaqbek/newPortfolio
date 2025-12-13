from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import List, Dict, Any
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class DatabaseService:
    """Read-only database service for accessing security logs and chat data."""

    def __init__(self):
        # Create read-only engine
        self.engine = create_engine(
            settings.POSTGRES_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
        )
        self.SessionLocal = sessionmaker(bind=self.engine)

    def get_security_logs(self, limit: int = 1000) -> List[Dict[str, Any]]:
        """Fetch recent security audit logs for embedding."""
        try:
            with self.SessionLocal() as session:
                query = text("""
                    SELECT
                        id,
                        "sessionId",
                        "activityType",
                        severity,
                        details,
                        "ipAddress",
                        "userAgent",
                        timestamp
                    FROM security_audit_logs
                    ORDER BY timestamp DESC
                    LIMIT :limit
                """)
                result = session.execute(query, {"limit": limit})
                logs = []
                for row in result:
                    logs.append({
                        "id": row.id,
                        "sessionId": row.sessionId,
                        "activityType": row.activityType,
                        "severity": row.severity,
                        "details": row.details,
                        "ipAddress": row.ipAddress,
                        "userAgent": row.userAgent,
                        "timestamp": row.timestamp.isoformat() if row.timestamp else None,
                    })
                return logs
        except Exception as e:
            logger.error(f"Error fetching security logs: {e}")
            return []

    def get_chat_messages(self, limit: int = 1000) -> List[Dict[str, Any]]:
        """Fetch recent chat messages for context."""
        try:
            with self.SessionLocal() as session:
                query = text("""
                    SELECT
                        id,
                        "sessionId",
                        role,
                        content,
                        timestamp,
                        sanitized,
                        flagged
                    FROM chat_messages
                    ORDER BY timestamp DESC
                    LIMIT :limit
                """)
                result = session.execute(query, {"limit": limit})
                messages = []
                for row in result:
                    messages.append({
                        "id": row.id,
                        "sessionId": row.sessionId,
                        "role": row.role,
                        "content": row.content,
                        "timestamp": row.timestamp.isoformat() if row.timestamp else None,
                        "sanitized": row.sanitized,
                        "flagged": row.flagged,
                    })
                return messages
        except Exception as e:
            logger.error(f"Error fetching chat messages: {e}")
            return []

    def get_attack_patterns(self) -> List[Dict[str, Any]]:
        """Analyze and return attack patterns from security logs."""
        try:
            with self.SessionLocal() as session:
                query = text("""
                    SELECT
                        "activityType",
                        severity,
                        COUNT(*) as count,
                        MAX(timestamp) as last_occurrence
                    FROM security_audit_logs
                    WHERE "activityType" = 'PROMPT_INJECTION_ATTEMPT'
                    GROUP BY "activityType", severity
                    ORDER BY count DESC
                """)
                result = session.execute(query)
                patterns = []
                for row in result:
                    patterns.append({
                        "activityType": row.activityType,
                        "severity": row.severity,
                        "count": row.count,
                        "last_occurrence": row.last_occurrence.isoformat() if row.last_occurrence else None,
                    })
                return patterns
        except Exception as e:
            logger.error(f"Error fetching attack patterns: {e}")
            return []

    def close(self):
        """Close database connection."""
        self.engine.dispose()


# Singleton instance
db_service = DatabaseService()
