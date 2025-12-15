"""
Script to embed initial data into ChromaDB.

This script loads portfolio data, documentation, and security logs
into the vector database for RAG.
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.chroma_service import chroma_service
from app.services.database_service import db_service
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def embed_security_logs():
    """Embed security logs from PostgreSQL."""
    logger.info("Embedding security logs...")

    logs = db_service.get_security_logs(limit=1000)
    if not logs:
        logger.warning("No security logs found")
        return

    documents = []
    metadatas = []
    ids = []

    for log in logs:
        # Create document text
        doc_text = f"""
Activity: {log['activityType']}
Severity: {log['severity']}
IP Address: {log['ipAddress']}
User Agent: {log.get('userAgent', 'Unknown')}
Details: {log.get('details', {})}
Timestamp: {log['timestamp']}
"""
        documents.append(doc_text.strip())
        metadatas.append({
            "type": "security_log",
            "activityType": log['activityType'],
            "severity": log['severity'],
            "timestamp": log['timestamp'],
        })
        ids.append(log['id'])

    success = chroma_service.add_documents(
        collection_name="security_logs",
        documents=documents,
        metadatas=metadatas,
        ids=ids,
    )

    if success:
        logger.info(f"Embedded {len(documents)} security logs")
    else:
        logger.error("Failed to embed security logs")


def embed_portfolio_data():
    """Embed portfolio and project data."""
    logger.info("Embedding portfolio data...")

    import json

    # Load actual profile data
    # Try multiple possible paths
    possible_paths = [
        "data/profile.json",  # Railway: in python-rag-service/data/
        "../data/profile.json",  # When run from scripts/ directory locally
        "../../data/profile.json",  # When run from python-rag-service/ locally
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "profile.json"),  # Absolute from script location
    ]

    profile = None
    for profile_path in possible_paths:
        try:
            if os.path.exists(profile_path):
                with open(profile_path, 'r', encoding='utf-8') as f:
                    profile = json.load(f)
                    logger.info(f"Loaded profile from: {profile_path}")
                    break
        except Exception as e:
            logger.debug(f"Could not load from {profile_path}: {e}")
            continue

    if not profile:
        logger.error("Profile not found in any expected location!")
        logger.error(f"Tried paths: {possible_paths}")
        profile = {"name": "Jakub Skwierawski", "title": "Developer"}

    # Create detailed portfolio documents
    portfolio_docs = [
        {
            "content": f"""
Name: {profile.get('name', 'Jakub Skwierawski')}
Title: {profile.get('title', 'Full Stack Developer')}
Location: {profile.get('location', 'Poland')}

Bio: {profile.get('bio', '')}

Contact:
- Email: {profile.get('contact', {}).get('email', 'jaqbek.eth@gmail.com')}
- Twitter: {profile.get('contact', {}).get('twitter', '@jaqbek_eth')}
- Telegram: {profile.get('contact', {}).get('telegram', '@jaqbek')}
""",
            "metadata": {"type": "profile", "source": "profile.json", "person": "Jakub Skwierawski"},
        },
        {
            "content": f"""
Jakub Skwierawski - Technical Skills:

Programming Languages: {', '.join(profile.get('skills', {}).get('languages', []))}
Frameworks: {', '.join(profile.get('skills', {}).get('frameworks', []))}
Blockchain: {', '.join(profile.get('skills', {}).get('blockchain', []))}
AI/ML: {', '.join(profile.get('skills', {}).get('ai-ml', []))}
Tools: {', '.join(profile.get('skills', {}).get('tools', []))}
Databases: {', '.join(profile.get('skills', {}).get('databases', []))}
Other: {', '.join(profile.get('skills', {}).get('other', []))}
""",
            "metadata": {"type": "skills", "source": "profile.json", "person": "Jakub Skwierawski"},
        },
    ]

    # Add each experience
    for exp in profile.get('experience', []):
        company_name = exp.get('company', '')

        # Add clear context to prevent confusion
        context_note = ""
        if "Protokół 999" in company_name or "protokol" in company_name.lower():
            context_note = "\nIMPORTANT: Protokół 999 is a MEDICAL EMERGENCY TRAINING PLATFORM for paramedics, NOT a cybersecurity project."

        exp_content = f"""
Jakub Skwierawski - Work Experience:

Position: {exp.get('title', '')}
Company: {company_name}
Period: {exp.get('period', {}).get('start', '')} - {exp.get('period', {}).get('end', 'Present')}
Location: {exp.get('location', '')}

Description: {exp.get('description', '')}
{context_note}

Key Achievements:
{chr(10).join(f'- {achievement}' for achievement in exp.get('achievements', []))}

Technologies: {', '.join(exp.get('technologies', []))}
"""
        portfolio_docs.append({
            "content": exp_content.strip(),
            "metadata": {
                "type": "experience",
                "source": "profile.json",
                "person": "Jakub Skwierawski",
                "company": company_name,
                "title": exp.get('title', ''),
                "category": "medical" if "protokół 999" in company_name.lower() else "other"
            },
        })

    # Add each project
    for proj in profile.get('projects', []):
        features_list = '\n'.join(f'- {feature}' for feature in proj.get('features', []))
        highlights_list = '\n'.join(f'- {highlight}' for highlight in proj.get('highlights', []))

        project_name = proj.get('name', '')

        # Add clear context to prevent confusion with other projects
        context_note = ""
        if "portfolio" in project_name.lower() and "guardian" in project_name.lower():
            context_note = "\nIMPORTANT: This is Jakub's PERSONAL PORTFOLIO WEBSITE with Guardian Security System (chatbot security). This is NOT related to Protokół 999 (medical platform)."

        proj_content = f"""
Jakub Skwierawski - Project:

Name: {project_name}
Category: {proj.get('category', '')}
Status: {proj.get('status', '')}
Period: {proj.get('period', {}).get('start', '')} - {proj.get('period', {}).get('end', 'Present')}

Description: {proj.get('description', '')}
{context_note}

Key Features:
{features_list}

Highlights:
{highlights_list}

Technologies: {', '.join(proj.get('technologies', []))}
"""
        portfolio_docs.append({
            "content": proj_content.strip(),
            "metadata": {
                "type": "project",
                "source": "profile.json",
                "person": "Jakub Skwierawski",
                "project_name": project_name,
                "category": proj.get('category', ''),
                "is_portfolio": "portfolio" in project_name.lower()
            },
        })

    documents = [doc["content"].strip() for doc in portfolio_docs]
    metadatas = [doc["metadata"] for doc in portfolio_docs]

    success = chroma_service.add_documents(
        collection_name="portfolio",
        documents=documents,
        metadatas=metadatas,
    )

    if success:
        logger.info(f"Embedded {len(documents)} portfolio documents")
    else:
        logger.error("Failed to embed portfolio data")


def embed_documentation():
    """Embed documentation and knowledge base."""
    logger.info("Embedding documentation...")

    docs = [
        {
            "content": """
Jakub Skwierawski - Python Expertise:
Jakub has experience with Python programming, particularly for:
- Building microservices with FastAPI framework
- Implementing RAG (Retrieval-Augmented Generation) systems
- Working with vector databases (ChromaDB)
- Creating AI-powered applications with semantic search
- Using Sentence Transformers for text embeddings
- Database integration with SQLAlchemy and PostgreSQL
- Docker containerization of Python applications

Key Python Libraries Used:
- FastAPI: Modern async web framework for building APIs
- ChromaDB: Vector database for semantic search
- Sentence Transformers: For generating text embeddings
- SQLAlchemy: Database ORM
- Pydantic: Data validation
- Uvicorn: ASGI server
- httpx: Async HTTP client for API calls
""",
            "metadata": {"type": "skills", "topic": "Python", "person": "Jakub Skwierawski"},
        },
        {
            "content": """
RAG (Retrieval-Augmented Generation):
A technique that enhances LLM responses by retrieving relevant context from a knowledge base.
The system searches for semantically similar documents and includes them as context for the LLM.

Jakub implemented a full RAG pipeline in his Interactive Portfolio project using:
- ChromaDB for vector storage
- Sentence Transformers for embeddings (all-MiniLM-L6-v2 model)
- FastAPI for the RAG service API
- Semantic search across portfolio, documentation, and security logs
- Context-aware AI responses with DeepSeek
""",
            "metadata": {"type": "concept", "topic": "RAG", "person": "Jakub Skwierawski"},
        },
        {
            "content": """
ChromaDB:
An open-source vector database designed for AI applications.
It stores embeddings and enables efficient similarity search.
Supports metadata filtering and persistence.

In Jakub's portfolio, ChromaDB is used to:
- Store embeddings of portfolio data, documentation, security logs
- Enable semantic similarity search with cosine distance
- Provide context for RAG-enhanced chatbot responses
- Handle 5 separate collections for organized knowledge retrieval
""",
            "metadata": {"type": "technology", "topic": "ChromaDB"},
        },
        {
            "content": """
FastAPI:
A modern Python web framework for building APIs.
Features automatic OpenAPI documentation, async support, and type validation.

Jakub used FastAPI to build the RAG Assistant microservice with:
- RESTful API endpoints for chat, document upload, and search
- Async support for concurrent request handling
- Automatic Swagger/OpenAPI documentation
- Pydantic models for request/response validation
- Integration with ChromaDB and DeepSeek API
- CORS configuration for Next.js frontend integration
""",
            "metadata": {"type": "technology", "topic": "FastAPI", "person": "Jakub Skwierawski"},
        },
        {
            "content": """
Docker:
Jakub uses Docker for containerization and deployment.

In the Interactive Portfolio project:
- Dockerized the Python FastAPI service for portable deployment
- Created docker-compose.yml for orchestrating services
- Configured environment variables for cloud deployment
- Enabled scalable microservices architecture
- Simplified deployment to Heroku and other cloud platforms
""",
            "metadata": {"type": "technology", "topic": "Docker", "person": "Jakub Skwierawski"},
        },
    ]

    documents = [doc["content"].strip() for doc in docs]
    metadatas = [doc["metadata"] for doc in docs]

    success = chroma_service.add_documents(
        collection_name="documentation",
        documents=documents,
        metadatas=metadatas,
    )

    if success:
        logger.info(f"Embedded {len(documents)} documentation entries")
    else:
        logger.error("Failed to embed documentation")


def main():
    """Run all embedding tasks."""
    logger.info("Starting initial data embedding...")

    # Get current stats
    stats_before = chroma_service.get_stats()
    logger.info(f"Collections before: {stats_before}")

    # Embed data
    embed_portfolio_data()
    embed_documentation()
    embed_security_logs()

    # Embed GitHub repositories
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token:
        logger.info("GitHub token found, fetching repositories...")
        try:
            from fetch_github_repos import embed_github_repos
            embed_github_repos(github_token)
        except Exception as e:
            logger.error(f"Error embedding GitHub repos: {e}")
            logger.info("Continuing without GitHub repos...")
    else:
        logger.warning("GITHUB_TOKEN not found, skipping GitHub repos embedding")

    # Get updated stats
    stats_after = chroma_service.get_stats()
    logger.info(f"Collections after: {stats_after}")

    logger.info("Initial data embedding complete!")


if __name__ == "__main__":
    main()
