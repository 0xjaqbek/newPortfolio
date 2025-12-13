"""
Script to fetch GitHub repositories and embed them into ChromaDB.

This script fetches all repos with detailed information including:
- Repository metadata (name, description, languages, topics)
- First and last commit timestamps for timeline
- README content for better context
"""

import sys
import os
import base64

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.chroma_service import chroma_service
from app.core.config import settings
import logging
import httpx
from datetime import datetime
from typing import List, Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GitHubFetcher:
    """Fetches GitHub repository data for embedding."""

    def __init__(self, github_token: str):
        self.token = github_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {github_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        self.client = httpx.Client(headers=self.headers, timeout=30.0)

    def get_user_repos(self) -> List[Dict[str, Any]]:
        """Fetch all repositories for the authenticated user."""
        try:
            repos = []
            page = 1
            per_page = 100

            while True:
                response = self.client.get(
                    f"{self.base_url}/user/repos",
                    params={
                        "per_page": per_page,
                        "page": page,
                        "sort": "updated",
                        "affiliation": "owner",
                    },
                )
                response.raise_for_status()
                page_repos = response.json()

                if not page_repos:
                    break

                repos.extend(page_repos)
                page += 1

                # GitHub API rate limiting - check if there are more pages
                if len(page_repos) < per_page:
                    break

            logger.info(f"Fetched {len(repos)} repositories")
            return repos

        except Exception as e:
            logger.error(f"Error fetching repositories: {e}")
            return []

    def get_commit_timeline(self, owner: str, repo: str) -> Dict[str, Optional[str]]:
        """Get first and last commit timestamps."""
        try:
            # Get first commit
            first_commit_response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/commits",
                params={"per_page": 1, "sha": "HEAD"},
            )

            # Get the total count and fetch the last page
            # GitHub doesn't provide total count directly, so we'll get the last commit from default branch
            last_commit_response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/commits",
                params={"per_page": 1, "page": 1},
            )

            first_commit = None
            last_commit = None

            if last_commit_response.status_code == 200:
                last_commit_data = last_commit_response.json()
                if last_commit_data:
                    last_commit = last_commit_data[0]["commit"]["author"]["date"]

            # To get the first commit, we need to traverse to the oldest
            # For efficiency, we'll use a different approach: get all commits and take the last one
            # But this can be expensive, so we'll try to get the oldest commit by fetching with reverse order

            # Alternative: Get commits in reverse chronological order and get the last page
            # Since GitHub API doesn't support reverse order directly, we'll get repo creation date as approximation
            # and fetch early commits

            # Simpler approach: use repository created_at as first commit approximation
            # and fetch actual first commit if repo is small

            try:
                # Try to get oldest commits (this works for smaller repos)
                all_commits_response = self.client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/commits",
                    params={"per_page": 100},
                )

                if all_commits_response.status_code == 200:
                    all_commits = all_commits_response.json()
                    if all_commits:
                        # The last commit in the list is the oldest in this page
                        # For repos with > 100 commits, we'd need pagination
                        # For now, we'll use the oldest commit from first 100
                        first_commit = all_commits[-1]["commit"]["author"]["date"]
            except:
                pass

            return {
                "first_commit": first_commit,
                "last_commit": last_commit,
            }

        except Exception as e:
            logger.error(f"Error fetching commit timeline for {owner}/{repo}: {e}")
            return {"first_commit": None, "last_commit": None}

    def get_readme(self, owner: str, repo: str) -> Optional[str]:
        """Fetch repository README content."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/readme",
            )

            if response.status_code == 200:
                readme_data = response.json()
                # README content is base64 encoded
                content = base64.b64decode(readme_data["content"]).decode("utf-8")
                return content
            else:
                return None

        except Exception as e:
            logger.error(f"Error fetching README for {owner}/{repo}: {e}")
            return None

    def get_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Fetch repository languages."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/languages",
            )

            if response.status_code == 200:
                return response.json()
            else:
                return {}

        except Exception as e:
            logger.error(f"Error fetching languages for {owner}/{repo}: {e}")
            return {}

    def close(self):
        """Close HTTP client."""
        self.client.close()


def embed_github_repos(github_token: str):
    """Fetch and embed GitHub repositories."""
    logger.info("Fetching GitHub repositories...")

    fetcher = GitHubFetcher(github_token)

    try:
        # Fetch all repos
        repos = fetcher.get_user_repos()

        if not repos:
            logger.warning("No repositories found")
            return

        documents = []
        metadatas = []
        ids = []

        for repo in repos:
            owner = repo["owner"]["login"]
            repo_name = repo["name"]

            logger.info(f"Processing repository: {owner}/{repo_name}")

            # Get commit timeline
            timeline = fetcher.get_commit_timeline(owner, repo_name)

            # Get languages
            languages = fetcher.get_languages(owner, repo_name)
            language_list = list(languages.keys()) if languages else []

            # Get README
            readme = fetcher.get_readme(owner, repo_name)

            # Format dates
            created_at = repo.get("created_at", "")
            updated_at = repo.get("updated_at", "")
            first_commit = timeline.get("first_commit", created_at)
            last_commit = timeline.get("last_commit", updated_at)

            # Parse dates for better formatting
            try:
                if first_commit:
                    first_commit_dt = datetime.fromisoformat(first_commit.replace("Z", "+00:00"))
                    first_commit_formatted = first_commit_dt.strftime("%Y-%m-%d %H:%M:%S UTC")
                else:
                    first_commit_formatted = "Unknown"

                if last_commit:
                    last_commit_dt = datetime.fromisoformat(last_commit.replace("Z", "+00:00"))
                    last_commit_formatted = last_commit_dt.strftime("%Y-%m-%d %H:%M:%S UTC")
                else:
                    last_commit_formatted = "Unknown"
            except:
                first_commit_formatted = first_commit or "Unknown"
                last_commit_formatted = last_commit or "Unknown"

            # Build document content
            doc_content = f"""
Jakub Skwierawski - GitHub Repository: {repo_name}

Repository Name: {repo_name}
Full Name: {repo.get("full_name", "")}
Description: {repo.get("description", "No description")}
URL: {repo.get("html_url", "")}

Timeline:
- Repository Created: {created_at}
- First Commit: {first_commit_formatted}
- Last Commit: {last_commit_formatted}
- Last Updated: {updated_at}

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

            # Add README if available
            if readme:
                # Limit README length to avoid too large embeddings
                readme_preview = readme[:2000] + "..." if len(readme) > 2000 else readme
                doc_content += f"\n\nREADME Preview:\n{readme_preview}"

            documents.append(doc_content.strip())
            metadatas.append({
                "type": "github_repo",
                "source": "github_api",
                "person": "Jakub Skwierawski",
                "repo_name": repo_name,
                "owner": owner,
                "url": repo.get("html_url", ""),
                "languages": language_list,
                "topics": repo.get("topics", []),
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "created_at": created_at,
                "first_commit": first_commit or created_at,
                "last_commit": last_commit or updated_at,
                "is_private": repo.get("private", False),
                "is_fork": repo.get("fork", False),
            })
            ids.append(f"github_{owner}_{repo_name}")

        # Embed into ChromaDB
        success = chroma_service.add_documents(
            collection_name="portfolio",
            documents=documents,
            metadatas=metadatas,
            ids=ids,
        )

        if success:
            logger.info(f"Successfully embedded {len(documents)} GitHub repositories")
        else:
            logger.error("Failed to embed GitHub repositories")

    finally:
        fetcher.close()


def main():
    """Main function."""
    # Get GitHub token from environment
    github_token = os.getenv("GITHUB_TOKEN")

    if not github_token:
        logger.error("GITHUB_TOKEN environment variable not set")
        logger.info("Please set GITHUB_TOKEN in your .env file")
        return

    logger.info("Starting GitHub repository embedding...")
    embed_github_repos(github_token)
    logger.info("GitHub repository embedding complete!")


if __name__ == "__main__":
    main()
