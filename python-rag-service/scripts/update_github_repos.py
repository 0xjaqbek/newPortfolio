"""
Standalone script to update GitHub repositories in ChromaDB.

Run this script periodically to refresh GitHub repo data with latest commits and stats.
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fetch_github_repos import embed_github_repos
from app.services.chroma_service import chroma_service
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Update GitHub repositories in ChromaDB."""
    github_token = os.getenv("GITHUB_TOKEN")

    if not github_token:
        logger.error("GITHUB_TOKEN environment variable not set")
        return

    logger.info("Updating GitHub repositories...")

    # Note: This will add new repos or update existing ones
    # GitHub repo IDs are formatted as: github_{owner}_{repo_name}
    # If you want to completely refresh, delete the collection first

    embed_github_repos(github_token)

    # Get stats
    stats = chroma_service.get_stats()
    logger.info(f"Updated collections: {stats}")
    logger.info("GitHub repositories update complete!")


if __name__ == "__main__":
    main()
