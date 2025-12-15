"""
Comprehensive GitHub data fetcher.
Fetches ALL available data from GitHub API and saves to JSON file.
"""

import os
import sys
import json
import httpx
import base64
from datetime import datetime
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load .env from parent directory (newPortfolio/.env)
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(env_path)

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ComprehensiveGitHubFetcher:
    """Fetches comprehensive GitHub data."""

    def __init__(self, github_token: str):
        self.token = github_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {github_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        self.client = httpx.Client(headers=self.headers, timeout=60.0)

    def get_user_info(self) -> Dict[str, Any]:
        """Fetch authenticated user information."""
        try:
            response = self.client.get(f"{self.base_url}/user")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching user info: {e}")
            return {}

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
                        "affiliation": "owner,collaborator",
                        "visibility": "all",
                    },
                )
                response.raise_for_status()
                page_repos = response.json()

                if not page_repos:
                    break

                repos.extend(page_repos)
                page += 1

                if len(page_repos) < per_page:
                    break

            logger.info(f"Fetched {len(repos)} repositories")
            return repos

        except Exception as e:
            logger.error(f"Error fetching repositories: {e}")
            return []

    def get_commits(self, owner: str, repo: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch commits for a repository."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/commits",
                params={"per_page": limit},
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error fetching commits for {owner}/{repo}: {e}")
            return []

    def get_branches(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        """Fetch branches for a repository."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/branches"
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error fetching branches for {owner}/{repo}: {e}")
            return []

    def get_contributors(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        """Fetch contributors for a repository."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/contributors"
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error fetching contributors for {owner}/{repo}: {e}")
            return []

    def get_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Fetch repository languages."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/languages"
            )
            if response.status_code == 200:
                return response.json()
            return {}
        except Exception as e:
            logger.error(f"Error fetching languages for {owner}/{repo}: {e}")
            return {}

    def get_readme(self, owner: str, repo: str) -> Optional[str]:
        """Fetch repository README content."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/readme"
            )
            if response.status_code == 200:
                readme_data = response.json()
                content = base64.b64decode(readme_data["content"]).decode("utf-8")
                return content
            return None
        except Exception as e:
            logger.error(f"Error fetching README for {owner}/{repo}: {e}")
            return None

    def get_releases(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        """Fetch releases for a repository."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/releases"
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error fetching releases for {owner}/{repo}: {e}")
            return []

    def get_issues(self, owner: str, repo: str, state: str = "all", limit: int = 30) -> List[Dict[str, Any]]:
        """Fetch issues for a repository."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/issues",
                params={"state": state, "per_page": limit},
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error fetching issues for {owner}/{repo}: {e}")
            return []

    def get_pull_requests(self, owner: str, repo: str, state: str = "all", limit: int = 30) -> List[Dict[str, Any]]:
        """Fetch pull requests for a repository."""
        try:
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/pulls",
                params={"state": state, "per_page": limit},
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.error(f"Error fetching pull requests for {owner}/{repo}: {e}")
            return []

    def get_topics(self, owner: str, repo: str) -> List[str]:
        """Fetch repository topics."""
        try:
            headers = {**self.headers, "Accept": "application/vnd.github.mercy-preview+json"}
            response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/topics",
                headers=headers,
            )
            if response.status_code == 200:
                return response.json().get("names", [])
            return []
        except Exception as e:
            logger.error(f"Error fetching topics for {owner}/{repo}: {e}")
            return []

    def get_traffic_stats(self, owner: str, repo: str) -> Dict[str, Any]:
        """Fetch traffic statistics (views, clones) for a repository."""
        try:
            views_response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/traffic/views"
            )
            clones_response = self.client.get(
                f"{self.base_url}/repos/{owner}/{repo}/traffic/clones"
            )

            traffic = {}
            if views_response.status_code == 200:
                traffic["views"] = views_response.json()
            if clones_response.status_code == 200:
                traffic["clones"] = clones_response.json()

            return traffic
        except Exception as e:
            logger.error(f"Error fetching traffic stats for {owner}/{repo}: {e}")
            return {}

    def fetch_comprehensive_data(self) -> Dict[str, Any]:
        """Fetch all available GitHub data."""
        logger.info("Fetching comprehensive GitHub data...")

        # Get user info
        user_info = self.get_user_info()
        logger.info(f"Fetched user info for: {user_info.get('login', 'Unknown')}")

        # Get all repositories
        repos = self.get_user_repos()
        logger.info(f"Fetched {len(repos)} repositories")

        # Enrich each repository with detailed data
        enriched_repos = []
        for i, repo in enumerate(repos, 1):
            owner = repo["owner"]["login"]
            repo_name = repo["name"]

            logger.info(f"[{i}/{len(repos)}] Processing {owner}/{repo_name}...")

            # Get additional data for each repo
            commits = self.get_commits(owner, repo_name, limit=100)
            branches = self.get_branches(owner, repo_name)
            contributors = self.get_contributors(owner, repo_name)
            languages = self.get_languages(owner, repo_name)
            readme = self.get_readme(owner, repo_name)
            releases = self.get_releases(owner, repo_name)
            issues = self.get_issues(owner, repo_name, limit=30)
            pull_requests = self.get_pull_requests(owner, repo_name, limit=30)
            topics = self.get_topics(owner, repo_name)
            traffic = self.get_traffic_stats(owner, repo_name)

            # Calculate commit timeline
            first_commit = commits[-1] if commits else None
            last_commit = commits[0] if commits else None

            enriched_repo = {
                **repo,
                "additional_data": {
                    "commits_fetched": len(commits),
                    "first_commit": first_commit,
                    "last_commit": last_commit,
                    "branches": branches,
                    "contributors": contributors,
                    "languages": languages,
                    "readme_content": readme,
                    "releases": releases,
                    "issues_count": len(issues),
                    "pull_requests_count": len(pull_requests),
                    "topics": topics,
                    "traffic_stats": traffic,
                },
            }

            enriched_repos.append(enriched_repo)

        return {
            "user_info": user_info,
            "repositories": enriched_repos,
            "total_repositories": len(enriched_repos),
            "fetched_at": datetime.utcnow().isoformat() + "Z",
        }

    def close(self):
        """Close HTTP client."""
        self.client.close()


def main():
    """Main function."""
    github_token = os.getenv("GITHUB_TOKEN")

    if not github_token:
        logger.error("GITHUB_TOKEN environment variable not set")
        return

    fetcher = ComprehensiveGitHubFetcher(github_token)

    try:
        # Fetch all data
        data = fetcher.fetch_comprehensive_data()

        # Save to JSON file
        output_file = "../data/github_comprehensive_data.json"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        logger.info(f"Comprehensive GitHub data saved to: {output_file}")
        logger.info(f"Total repositories: {data['total_repositories']}")
        logger.info(f"User: {data['user_info'].get('login', 'Unknown')}")

    finally:
        fetcher.close()


if __name__ == "__main__":
    main()
