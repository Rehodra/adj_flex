# AI Legal Courtroom Simulator - Backend

A comprehensive backend system for AI-powered legal education using Google Gemini AI and RAG (Retrieval-Augmented Generation) to help law students practice courtroom arguments in Indian law.

## 🚀 Features

- **AI Judge**: Evaluates legal arguments with scoring and feedback
- **AI Opponent**: Generates dynamic counter-arguments
- **RAG System**: Grounded responses in actual Indian legal documents
- **Multi-Phase Courtroom**: Opening statements, arguments, cross-examination, closing statements
- **Performance Analytics**: Detailed scoring and improvement suggestions
- **Session Management**: Multi-user session support
- **Real-time Evaluation**: Instant argument feedback

## 🏗️ Architecture

```
backend/
├── app/
│   ├── ai_system/          # AI Components
│   │   ├── rag/           # RAG System (Document Processing, Embeddings, Vector Store)
│   │   ├── agents/        # AI Agents (Judge, Opponent)
│   │   ├── prompts/       # System Prompts
│   │   └── utils/         # Utilities
│   ├── api/routes/        # API Endpoints
│   ├── models/            # Pydantic Schemas
│   └── services/          # Business Logic
├── data/legal_docs/       # Legal Documents
├── scripts/               # Utility Scripts
└── requirements.txt       # Dependencies
```

## 🛠️ Technology Stack

- **Backend**: FastAPI (Python)
- **AI**: Google Gemini API
- **Vector Database**: ChromaDB (local, persistent)
- **Embeddings**: Google Gemini Embeddings API
- **Document Processing**: Sentence Transformers
- **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Python 3.8 or higher
- UV (Python package manager) - install with `pip install uv`
- Google Gemini API Key
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd law/backend
```

### 2. Windows One-Command Setup (start.bat)

If you are on Windows, use `start.bat` for quick setup:

```bat
start.bat
```

What `start.bat` does:
- Uses existing virtual environment (`.venv-new` or `.venv`)
- Creates `.venv` with `uv venv .venv` if none exists
- Activates the virtual environment
- Installs dependencies from `requirements.txt`

How to run it:
- Recommended: Open terminal in `backend` and run `start.bat` (keeps environment active in that terminal)
- Optional: Double-click `start.bat` in File Explorer (works for setup/install, but activated environment will not remain available in your current VS Code terminal)

### 3. Windows One-Click Run (run.bat)

Use `run.bat` when you want setup + server startup in one command:

```bat
run.bat
```

What `run.bat` does:
- Calls `start.bat` to prepare environment and install dependencies
- Starts FastAPI with hot reload on port 8000

How to run it:
- Recommended: Open terminal in `backend` and run `run.bat`
- Optional: Double-click `run.bat` in File Explorer for quick local startup

### 4. Create Virtual Environment with UV (manual alternative)

```bash
# Option 1: Use the setup script (recommended)
uv run python setup.py

# Option 2: Manual setup
# Create virtual environment
uv venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux/Mac:
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt
```

### 5. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Add your Google Gemini API Key:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 6. Index Legal Documents

```bash
# Run the indexing script
uv run python scripts/index_legal_docs.py

# Or with custom options
uv run python scripts/index_legal_docs.py --test --test-query "What is murder?"
```

### 7. Start the Server

```bash
# Development mode
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 8. Access the API

- **API Documentation**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **API Root**: http://localhost:8000/

## 📚 API Endpoints

### Session Management
- `POST /api/session/create` - Create new game session
- `GET /api/session/{session_id}` - Get session details
- `PUT /api/session/{session_id}/phase` - Update session phase
- `DELETE /api/session/{session_id}` - Delete session
- `GET /api/session/user/{user_id}` - Get user sessions
- `GET /api/session/available/cases` - Get available cases

### Argument Submission
- `POST /api/argument/submit` - Submit argument and get evaluation
- `GET /api/argument/{session_id}/history` - Get argument history
- `GET /api/argument/{session_id}/analytics` - Get performance analytics
- `POST /api/argument/{session_id}/feedback` - Submit feedback
- `GET /api/argument/{session_id}/export` - Export session data

### System
- `GET /` - API information
- `GET /health` - Health check
- `GET /api/info` - Detailed API information

## 🎮 Usage Examples

### Create a Session

```bash
curl -X POST "http://localhost:8000/api/session/create" \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": "STATE_V_RAMESH",
    "user_id": "user123",
    "mode": "criminal"
  }'
```

### Submit an Argument

```bash
curl -X POST "http://localhost:8000/api/argument/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "argument_text": "The accused should be convicted under Section 302 IPC as there is clear evidence of intent to cause death...",
    "cited_sections": ["302", "300"],
    "phase": "argument"
  }'
```

## 📊 Scoring System

The AI Judge evaluates arguments based on three components:

- **Legal Accuracy (40%)**: Correct application of legal provisions and citations
- **Reasoning (35%)**: Logical structure, coherence, and argument flow
- **Evidence (25%)**: Proper evidence handling and integration with law

**Performance Tiers**:
- **Senior Counsel**: 85+ points
- **Competent Advocate**: 70-84 points
- **Junior Advocate**: 55-69 points
- **Law Student**: Below 55 points

## 🏛️ Legal Domains Covered

- **Criminal Law**: Indian Penal Code (IPC)
- **Civil Law**: Code of Civil Procedure (CPC)
- **Evidence Law**: Indian Evidence Act
- **Constitutional Law**: Constitution of India

## 📄 Legal Documents

The system includes sample IPC sections:
- Section 300: Murder
- Section 302: Punishment for murder
- Section 304: Culpable homicide not amounting to murder
- Section 376: Rape
- Section 378: Theft
- Section 420: Cheating

**Future Enhancement**: Integration with India Code (https://legislative.gov.in) or eCourts API for comprehensive legal database.

## 🔧 Configuration

### Environment Variables

```env
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key_here

# Application
ENV=development
DEBUG=True
SECRET_KEY=your-secret-key-change-this

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Vector Database
VECTOR_DB_PATH=./data/vector_db

# Logging
LOG_LEVEL=INFO
```

### AI Model Configuration

The system uses **Google Gemini** for AI-powered legal argument evaluation and opponent response generation.

### Current AI Settings:
- **Text Generation**: `gemini-1.5-pro`
- **Embeddings**: `embedding-001` 
- **API Key**: Set via `GEMINI_API_KEY` environment variable
- **Max Tokens**: 2000

## 🧪 Testing

### Unit Tests

```bash
uv run pytest tests/
```

### Integration Tests

```bash
uv run pytest tests/integration/
```

### Test Individual Components

```bash
# Test RAG system
uv run python -c "from app.ai_system.rag.retriever import RAGRetriever; print('✅ RAG System OK')"

# Test Judge Agent
uv run python -c "from app.ai_system.agents.judge_agent import JudgeAgent; print('✅ Judge Agent OK')"

# Test Opponent Agent
uv run python -c "from app.ai_system.agents.opponent_agent import OpponentAgent; print('✅ Opponent Agent OK')"
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── ai_system/
│   │   ├── rag/
│   │   │   ├── document_processor.py    # Legal document processing
│   │   │   ├── embeddings.py            # Gemini embeddings
│   │   │   ├── vector_store.py          # ChromaDB vector store
│   │   │   └── retriever.py             # RAG retrieval system
│   │   ├── agents/
│   │   │   ├── base_agent.py            # Base AI agent
│   │   │   ├── judge_agent.py           # AI Judge
│   │   │   └── opponent_agent.py        # AI Opponent
│   │   ├── prompts/
│   │   │   ├── judge_prompts.py         # Judge system prompts
│   │   │   └── opponent_prompts.py      # Opponent system prompts
│   │   └── utils/
│   │       └── response_parser.py       # JSON response parsing
│   ├── api/routes/
│   │   ├── session.py                   # Session management
│   │   └── argument.py                  # Argument submission
│   ├── models/
│   │   └── schemas.py                   # Pydantic models
│   ├── services/
│   │   └── scoring_service.py           # Scoring logic
│   ├── config.py                       # Configuration
│   └── main.py                          # FastAPI application
├── data/
│   └── legal_docs/
│       └── ipc/                         # IPC sections
├── scripts/
│   └── index_legal_docs.py             # Document indexing
├── requirements.txt                     # Python dependencies
├── .env.example                         # Environment template
└── README.md                           # This file
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t ai-legal-courtroom-backend .

# Run container
docker run -p 8000:8000 --env-file .env ai-legal-courtroom-backend
```

### Production Considerations

- Use Redis for session storage instead of in-memory
- Implement proper logging and monitoring
- Set up rate limiting
- Use HTTPS with SSL certificates
- Configure proper CORS for production domains
- Set up database backups for vector store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the [API Documentation](http://localhost:8000/docs)
2. Review the [Health Check](http://localhost:8000/health)
3. Check logs for error messages
4. Create an issue in the repository

## 🔮 Future Enhancements

- **India Code Integration**: Direct access to official legal database
- **eCourts API Integration**: Real-time case data
- **Multi-language Support**: Support for regional languages
- **Voice Input**: Speech-to-text for arguments
- **Video Conferencing**: Virtual courtroom sessions
- **Blockchain Certificates**: Verifiable skill certifications
- **Mobile API**: Native mobile applications

## 📈 Performance Metrics

- **Response Time**: < 3 seconds for argument evaluation
- **Accuracy**: Grounded in actual legal documents
- **Scalability**: Supports 100+ concurrent sessions
- **Availability**: 99.9% uptime target

---

**Built with ❤️ for legal education in India**
