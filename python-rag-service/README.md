# RAG Assistant - Python FastAPI Service

A Retrieval-Augmented Generation chatbot service powered by FastAPI, ChromaDB, and DeepSeek.

## Features

- **RAG Pipeline**: Semantic search across multiple knowledge collections
- **ChromaDB**: Vector database for efficient similarity search
- **DeepSeek Integration**: High-quality LLM responses
- **Document Upload**: API endpoint for adding documents to the knowledge base
- **Security Analytics**: Analyze attack patterns from security logs
- **PostgreSQL Integration**: Read-only access to security logs and chat history

## Project Structure

```
python-rag-service/
├── app/
│   ├── api/              # API routes
│   │   ├── chat.py       # Chat endpoint
│   │   ├── documents.py  # Document upload
│   │   ├── search.py     # Semantic search
│   │   └── security.py   # Security analytics
│   ├── core/             # Core configuration
│   ├── models/           # Pydantic models
│   └── services/         # Business logic
│       ├── chroma_service.py    # ChromaDB operations
│       ├── deepseek_service.py  # DeepSeek API
│       ├── rag_service.py       # RAG pipeline
│       └── database_service.py  # PostgreSQL access
├── embeddings/           # ChromaDB persistent storage
├── data/                 # Data files for embedding
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
└── Dockerfile           # Docker configuration
```

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run the service:**
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

### Docker

1. **Build and run:**
   ```bash
   docker-compose up --build
   ```

2. **Access the API:**
   - API: `http://localhost:8000`
   - Docs: `http://localhost:8000/docs`

## API Endpoints

### Chat
- `POST /api/chat/` - Chat with RAG support

### Documents
- `POST /api/documents/upload` - Upload a file
- `POST /api/documents/embed` - Embed raw text
- `GET /api/documents/collections` - List collections

### Search
- `POST /api/search/` - Semantic search

### Security
- `GET /api/security/analyze` - Analyze attack patterns
- `GET /api/security/logs` - Get security logs
- `GET /api/security/patterns` - Get attack patterns

### Health
- `GET /api/health/` - Health check
- `GET /api/health/stats` - System statistics

## Collections

The system maintains separate collections for:
- **portfolio**: GitHub repos and project info
- **documentation**: Technical docs and knowledge base
- **security_logs**: Security attack logs
- **chat_history**: Previous conversations
- **custom_docs**: User-uploaded documents

## Environment Variables

See `.env.example` for all configuration options.

Required:
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `DATABASE_URL`: PostgreSQL connection string

## Integration with Next.js

The Next.js frontend should proxy requests to this service via `/api/chat-rag`.

Example Next.js API route:
```typescript
// app/api/chat-rag/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch('http://localhost:8000/api/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response;
}
```
