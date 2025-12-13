# RAG Assistant Setup Guide

This guide will help you set up and run the dual AI chatbot system with the new RAG (Retrieval-Augmented Generation) assistant.

## System Overview

You now have **two AI chatbots** running in parallel:

1. **DeepSeek Direct** - Your original chatbot with direct API calls
2. **RAG Assistant** - New Python-based chatbot with semantic search powered by ChromaDB

Users can toggle between them via the Settings menu.

## Architecture

```
Next.js Frontend (Port 3000)
    ├─> /api/chat → DeepSeek Direct
    └─> /api/chat-rag → Python FastAPI (Port 8000)
            └─> ChromaDB Vector Store
            └─> PostgreSQL (Read-only for security logs)
            └─> DeepSeek API
```

## Prerequisites

- Node.js and npm (already installed)
- Python 3.11+
- PostgreSQL database (already configured)
- DeepSeek API key (already in .env)

## Setup Instructions

### Step 1: Install Python Dependencies

```bash
cd python-rag-service
pip install -r requirements.txt
```

### Step 2: Configure Environment

The Python service uses `.env` file in `python-rag-service/` directory.
It's already configured with your existing credentials.

Verify the following variables are set:
- `DEEPSEEK_API_KEY` - Your DeepSeek API key
- `DATABASE_URL` - PostgreSQL connection string
- `CHROMA_PERSIST_DIR` - Path for ChromaDB storage

### Step 3: Initial Data Embedding

Before running the service for the first time, embed your initial data:

```bash
cd python-rag-service
python scripts/embed_initial_data.py
```

This will:
- Load security logs from PostgreSQL
- Embed portfolio and project information
- Create documentation embeddings
- Initialize ChromaDB collections

### Step 4: Run the Python RAG Service

**Option A: Direct Python**
```bash
cd python-rag-service
python main.py
```

**Option B: Docker** (Recommended for production)
```bash
cd python-rag-service
docker-compose up --build
```

The service will start on `http://localhost:8000`

### Step 5: Update Prisma Schema (One-time)

Generate a new migration for the AI provider tracking:

```bash
npx prisma migrate dev --name add_ai_provider_tracking
```

This adds:
- `aiProvider` field to `ChatSession`
- `aiProvider` field to `ChatMessage`

### Step 6: Run Next.js Application

In a new terminal:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Using the Dual AI System

1. Open your portfolio at `http://localhost:3000`
2. Click the **Settings** button [⚙]
3. Scroll to the **AI Chatbot** section
4. Toggle between:
   - **DeepSeek Direct** - Fast, direct API calls
   - **RAG Assistant** - Semantic search with context from portfolio, docs, and security logs

The selected chatbot is indicated in the chat header: `[Direct]` or `[RAG]`

## RAG Assistant Features

### Collections

The RAG system maintains 5 knowledge collections:

1. **portfolio** - GitHub repos, projects, skills
2. **documentation** - Technical docs and knowledge base
3. **security_logs** - Security attack logs for threat analysis
4. **chat_history** - Previous RAG conversations
5. **custom_docs** - User-uploaded documents

### API Endpoints

The Python service exposes these endpoints:

**Chat**
- `POST /api/chat/` - RAG-powered chat

**Documents**
- `POST /api/documents/upload` - Upload files (.txt, .md, .json, .pdf)
- `POST /api/documents/embed` - Embed raw text
- `GET /api/documents/collections` - List all collections

**Search**
- `POST /api/search/` - Semantic similarity search

**Security**
- `GET /api/security/analyze` - AI-powered attack pattern analysis
- `GET /api/security/logs` - Recent security logs
- `GET /api/security/patterns` - Attack statistics

**Health**
- `GET /api/health/` - Health check
- `GET /api/health/stats` - Vector DB statistics

### Document Upload

You can add new documents to the knowledge base:

```bash
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@document.txt" \
  -F "collection=custom_docs" \
  -F 'metadata={"source":"manual_upload"}'
```

Or via the embed endpoint:

```bash
curl -X POST http://localhost:8000/api/documents/embed \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your document text here",
    "collection": "custom_docs",
    "metadata": {"source": "api"}
  }'
```

## How RAG Works

1. **User sends a message** → Chat window detects selected AI provider
2. **Semantic search** → ChromaDB finds similar documents across all collections
3. **Context building** → Top 3 relevant documents from each collection are retrieved
4. **Prompt enhancement** → Retrieved context is added to the system prompt
5. **LLM generation** → DeepSeek generates response with full context
6. **Response returned** → User receives contextually-aware answer

## Security Analytics

The RAG assistant has special capabilities for security analysis:

```bash
# Analyze attack patterns
curl http://localhost:8000/api/security/analyze
```

This will:
- Fetch recent security logs from PostgreSQL
- Search for similar historical attacks in ChromaDB
- Use AI to analyze trends and provide mitigation recommendations

## Troubleshooting

### Python service won't start
- Check Python version: `python --version` (need 3.11+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is free: `netstat -ano | findstr :8000`

### ChromaDB errors
- Delete embeddings directory and re-run: `rm -rf embeddings/`
- Run embedding script: `python scripts/embed_initial_data.py`

### RAG responses are not contextual
- Check collections have data: `GET /api/health/stats`
- Run embedding script to populate data
- Verify DATABASE_URL connects to PostgreSQL

### "Connection refused" when switching to RAG
- Ensure Python service is running on port 8000
- Check RAG_SERVICE_URL in Next.js .env: `http://localhost:8000`
- Verify CORS settings allow localhost:3000

## Deployment

### Heroku (Both Services)

**Next.js app:**
- Already deployed

**Python RAG Service:**
```bash
cd python-rag-service
heroku create your-rag-service
heroku config:set DEEPSEEK_API_KEY=your_key
heroku config:set DATABASE_URL=your_postgres_url
git push heroku main
```

Update Next.js .env:
```
RAG_SERVICE_URL=https://your-rag-service.herokuapp.com
```

### Docker (Recommended)

Build both services:
```bash
# Python service
cd python-rag-service
docker-compose up -d

# Next.js
docker build -t portfolio-next .
docker run -p 3000:3000 portfolio-next
```

## Development

### Adding New Documents to RAG

Edit `scripts/embed_initial_data.py` and add your documents:

```python
def embed_custom_data():
    docs = [
        {
            "content": "Your content here",
            "metadata": {"type": "feature", "topic": "topic"},
        },
    ]
    chroma_service.add_documents("custom_docs", documents, metadatas)
```

Then run:
```bash
python scripts/embed_initial_data.py
```

### Monitoring RAG Performance

Check vector DB stats:
```bash
curl http://localhost:8000/api/health/stats
```

View logs:
```bash
tail -f python-rag-service/logs/app.log
```

## API Documentation

FastAPI provides interactive API docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Next Steps

1. **Populate knowledge base** - Add more portfolio content, documentation
2. **Fine-tune retrieval** - Adjust `n_results` parameter in RAG service
3. **Monitor usage** - Track which chatbot users prefer
4. **Expand collections** - Add blog posts, code snippets, etc.
5. **Security insights** - Use `/api/security/analyze` to gain threat intelligence

## Support

For issues or questions:
1. Check API docs: `http://localhost:8000/docs`
2. Review logs in `python-rag-service/`
3. Test endpoints with curl or Postman
4. Verify environment variables are set correctly
