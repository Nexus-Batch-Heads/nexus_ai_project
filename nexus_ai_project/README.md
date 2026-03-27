# Nexus AI – Your Digital Twin & Life Decision Simulator

> A futuristic full-stack web application combining AI-powered digital twin creation with intelligent life decision simulation to help users make better choices.

![Nexus AI](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Overview](#database-overview)
- [LLM Models](#llm-models)
- [Development Guide](#development-guide)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview

**Nexus AI** is an innovative platform that combines two powerful concepts:

1. **Digital Twin** – An AI clone that learns your personality, communication style, and values through conversation and personality quizzes
2. **Life Decision Simulator** – Uses AI to generate realistic future scenarios based on your decisions, providing risk/reward analysis and personalized recommendations

The application helps users make informed life decisions by allowing them to:
- Train an AI clone that understands their personality
- Simulate different life path outcomes
- Get personalized advice from their digital twin
- Visualize decision trees with trajectory analysis

---

## ✨ Features

### 🧬 Digital Twin Creation
- **Personality Quiz** – AI collects data on risk tolerance, communication style, values, and goals
- **Chat-Based Training** – Conversational learning to refine the AI's understanding of the user
- **Voice Input** – Web Speech API for hands-free interaction
- **Animated Avatar** – Visual representation of the digital twin with Framer Motion animations
- **Personality Profile** – Persistent user profile stored in database

### 🔮 Life Decision Simulator
- **Scenario Generation** – AI creates 3-5 realistic future scenarios for any life decision
- **Risk/Reward Analysis** – Visual breakdown of risks and rewards for each path
- **Decision Tree Visualization** – Interactive flowchart showing decision outcomes
- **Best Path Recommendation** – AI recommends the optimal choice based on user's values
- **Historical Simulations** – Save and revisit past simulations
- **Export Capabilities** – Generate PDF reports of simulation results

### 💬 AI Chat Interface
- **"Advise Me" Mode** – Get personalized life advice from the AI based on trained personality
- **"Talk as Me" Mode** – Your digital twin responds as you would, in your voice and style
- **Multi-Modal Input** – Text, voice input, and file attachments (images, PDFs, text)
- **Real-Time Chat** – Instant responses with OpenAI GPT-4o Mini or Groq LLaMA
- **Chat History** – Persistent conversation storage in SQL database
- **Token Counting** – Real-time token calculation for quota management

### 🔐 Authentication & Authorization
- **Email/Password Registration** – Secure user account creation
- **Google OAuth Integration** – Social login with Google
- **JWT Authentication** – Stateless authentication with token expiration
- **Password Hashing** – bcrypt-based secure password storage
- **Protected Routes** – JWT-based API endpoint protection

### 📊 Usage Analytics
- **Token Tracking** – Monitor AI API token consumption per user
- **Usage Quotas** – Configurable limits on API calls and tokens
- **File Upload Tracking** – Monitor uploaded files and storage usage

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Next.js)                   │
│  ┌──────────────┬──────────────┬──────────────┐              │
│  │   Chat UI    │   Simulator  │   Dashboard  │              │
│  │  Twin Train  │  Auth Pages  │ Avatar Panel │              │
│  └──────────────┴──────────────┴──────────────┘              │
│                         ↓                                     │
│                 REST API (Axios/Fetch)                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              API LAYER (Flask Backend)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Route Layer (Blueprints)                  │   │
│  │  ┌────────────┬────────────┬────────────┐            │   │
│  │  │ auth_routes│chat_routes │upload_routes             │   │
│  │  └────────────┴────────────┴────────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Service Layer                             │   │
│  │  ┌──────────────────┬──────────────────┐            │   │
│  │  │  AIService       │  FileService     │            │   │
│  │  │ (LLM Integration)│ (File Upload)    │            │   │
│  │  └──────────────────┴──────────────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Models & Data Access Layer                 │   │
│  │  ┌──────────────┬──────────────┬──────────────┐      │   │
│  │  │ UserModel    │ ChatModel    │ UsageModel   │      │   │
│  │  └──────────────┴──────────────┴──────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Utilities & Helpers                           │   │
│  │  ┌──────────────┬──────────────┬──────────────┐      │   │
│  │  │ Token Counter│ Validators   │ Auth Helpers │      │   │
│  │  └──────────────┴──────────────┴──────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│           DATA & EXTERNAL SERVICES LAYER                    │
│  ┌──────────────────┬──────────────────┬──────────────────┐ │
│  │  MS SQL Server   │  MongoDB         │  External LLMs   │ │
│  │  (Primary DB)    │  (Discussions)   │  (OpenAI/Groq)   │ │
│  └──────────────────┴──────────────────┴──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**
   - User registers/logs in → JWT token issued → Token stored in browser
   - All subsequent requests include JWT in Authorization header

2. **Chat Flow**
   - User sends message → Flask validates JWT → AIService queries LLM → Response saved to DB → Response returned to client

3. **Simulation Flow**
   - User inputs decision → Flask triggers AIService → LLM generates scenarios → Results stored in chat history → Visualization sent to frontend

4. **File Upload Flow**
   - User uploads file → Flask validates & stores file → FileService processes file → Reference stored in database → File info returned to client

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.1 (React 18.2.0)
- **Styling**: Tailwind CSS 3.4.0
- **Animations**: Framer Motion 11.0.0
- **State Management**: React Context API
- **HTTP Client**: Axios/Fetch API
- **Charts/Data**: Recharts 2.12.0, html2canvas, jsPDF
- **Icons**: React Icons 5.0.0
- **Node.js**: 18+

### Backend
- **Framework**: Flask 3.1.0
- **Database (Primary)**: MS SQL Server (via pyodbc 5.2.0)
- **Database (Secondary)**: MongoDB (via pymongo 4.11.3)
- **ORM**: SQLAlchemy 2.0.36
- **Authentication**: Flask-JWT-Extended 4.7.1, bcrypt 4.2.1
- **CORS**: Flask-CORS 5.0.1
- **Server**: Gunicorn 23.0.0
- **Security**: python-dotenv 1.0.1, google-auth 2.38.0
- **HTTP Client**: httpx 0.28.1
- **LLM Integration**: OpenAI 1.61.1, Groq 0.15.0
- **Python**: 3.9+

### External Services
- **LLM Providers**:
  - OpenAI GPT-4o Mini (default)
  - Groq LLaMA 3.1 70B (alternative)
  - Built-in Mock Engine (demo mode)
- **Authentication**: Google OAuth 2.0
- **Web APIs**: Web Speech API (client-side)

---

## 🚀 Installation & Setup

### Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- **MS SQL Server** (local or cloud instance)
- **Git**
- API Keys (optional but recommended):
  - OpenAI API key (for GPT-4o Mini)
  - Groq API key (for LLaMA)
  - Google OAuth credentials

### Backend Setup

#### 1. Clone and Navigate to Backend
```bash
git clone https://github.com/Nexus-Batch-Heads/nexus_ai_project.git
cd nexus_ai_project/backend
```

#### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Create `.env` File
```bash
cp .env.example .env
```

### Frontend Setup

#### 1. Navigate to Frontend
```bash
cd ../frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Create `.env.local` File
```bash
cp .env.example .env.local
```

---

## ⚙️ Configuration

### Backend Configuration (`.env`)

```env
# Database Configuration
DATABASE_URL=mssql+pyodbc://username:password@server/database?driver=ODBC+Driver+17+for+SQL+Server
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus_ai

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRES=86400

# LLM Configuration (Choose one)
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1

# Groq Configuration (takes priority if both set)
GROQ_API_KEY=gsk-...
GROQ_BASE_URL=https://api.groq.com/openai/v1

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Upload
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Frontend Configuration (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# LLM Configuration (used for client-side validation)
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_GROQ_API_KEY=gsk-...

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
```

---

## 🏃 Running the Application

### Development Mode

#### Terminal 1: Backend Server
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
# Runs on http://localhost:5000
```

#### Terminal 2: Frontend Server
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

#### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Production Mode

#### Backend
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google-oauth-token"
}

Response: 200 OK
{
  "success": true,
  "message": "Google login successful",
  "user": { ... },
  "token": "jwt-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "personality_profile": { ... },
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Chat Endpoints

#### Send Chat Message
```http
POST /api/chat/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "I'm thinking about changing careers",
  "chat_mode": "advise_me",
  "file_id": "optional-file-uuid"
}

Response: 200 OK
{
  "success": true,
  "response": "Based on your personality profile...",
  "chat_id": "uuid",
  "tokens_used": 450,
  "usage_remaining": 9550
}
```

#### Get Chat History
```http
GET /api/chat/history?limit=50&offset=0
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "chats": [
    {
      "id": "uuid",
      "message": "user message",
      "response": "ai response",
      "chat_mode": "advise_me",
      "created_at": "2024-01-15T10:30:00Z",
      "tokens_used": 450
    }
  ],
  "total": 127,
  "limit": 50,
  "offset": 0
}
```

#### Delete Chat
```http
DELETE /api/chat/{chat_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

### Simulation Endpoints

#### Start Simulation
```http
POST /api/simulator/simulate
Authorization: Bearer {token}
Content-Type: application/json

{
  "decision": "Should I move to a new city for a tech job?",
  "context": "I have a family and 5 years experience"
}

Response: 200 OK
{
  "success": true,
  "simulation_id": "uuid",
  "scenarios": [
    {
      "scenario_id": 1,
      "title": "Scenario 1: Take the Job",
      "description": "You move to the new city...",
      "pros": [...],
      "cons": [...],
      "risk_score": 0.65,
      "reward_score": 0.85,
      "alignment_score": 0.78
    }
  ],
  "best_path": 1,
  "tokens_used": 2500
}
```

### File Upload Endpoints

#### Upload File
```http
POST /api/upload/file
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <binary-file-data>

Response: 201 Created
{
  "success": true,
  "file": {
    "id": "uuid",
    "filename": "document.pdf",
    "original_name": "my-document.pdf",
    "mime_type": "application/pdf",
    "size_bytes": 245678,
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "personality_profile": {
      "risk_tolerance": 0.65,
      "communication_style": "direct",
      "core_values": ["family", "growth", "integrity"],
      "goals": ["career advancement", "work-life balance"]
    },
    "twin_trained": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Personality Profile
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "personality_profile": {
    "risk_tolerance": 0.75,
    "communication_style": "collaborative",
    "core_values": ["family", "innovation", "integrity"],
    "goals": ["leadership", "work-life balance"]
  }
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## 📁 Project Structure

```
nexus_ai_project/
├── backend/
│   ├── app.py                          # Flask app factory
│   ├── config.py                       # Configuration management
│   ├── extensions.py                   # Flask extensions (DB, JWT, CORS)
│   ├── requirements.txt                # Python dependencies
│   ├── .env.example                    # Environment variables template
│   │
│   ├── models/                         # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user_model.py              # User account and profile
│   │   ├── chat_model.py              # Chat history and messages
│   │   ├── file_model.py              # File upload metadata
│   │   └── usage_model.py             # API usage tracking
│   │
│   ├── routes/                         # API route handlers (blueprints)
│   │   ├── __init__.py
│   │   ├── auth_routes.py             # Authentication endpoints
│   │   ├── chat_routes.py             # Chat and messaging
│   │   ├── upload_routes.py           # File upload handling
│   │   └── user_routes.py             # User profile management
│   │
│   ├── services/                       # Business logic
│   │   ├── __init__.py
│   │   ├── ai_service.py              # LLM integration (OpenAI/Groq)
│   │   └── file_service.py            # File processing and storage
│   │
│   ├── utils/                          # Helper functions
│   │   ├── __init__.py
│   │   ├── helpers.py                 # Common utilities
│   │   └── token_counter.py           # Token counting for LLMs
│   │
│   ├── uploads/                        # Uploaded files storage
│   └── instance/                       # SQLite (development)
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── jsconfig.json
│   ├── .env.example
│   ├── README.md
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js                # Home page
│   │   │   ├── layout.js              # Root layout
│   │   │   ├── globals.css            # Global styles
│   │   │   │
│   │   │   ├── api/                   # API routes (Next.js API)
│   │   │   │   ├── auth/
│   │   │   │   │   ├── register/      # Register endpoint
│   │   │   │   │   ├── login/         # Login endpoint
│   │   │   │   │   ├── me/            # Current user
│   │   │   │   │   └── google/        # Google OAuth
│   │   │   │   ├── chat/              # Chat API endpoint
│   │   │   │   ├── twin/              # Twin training endpoint
│   │   │   │   ├── simulate/          # Simulator endpoint
│   │   │   │   └── upload/            # File upload endpoint
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   └── page.js            # Chat interface page
│   │   │   ├── dashboard/
│   │   │   │   └── page.js            # User dashboard
│   │   │   ├── login/
│   │   │   │   └── page.js            # Login page
│   │   │   ├── signup/
│   │   │   │   └── page.js            # Registration page
│   │   │   ├── simulator/
│   │   │   │   └── page.js            # Decision simulator
│   │   │   └── twin/
│   │   │       └── page.js            # Twin training page
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.js          # Navigation bar
│   │   │   └── avatar/
│   │   │       └── AnimatedAvatar.js  # AI avatar animation
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.js         # Auth state management
│   │   │   └── ThemeContext.js        # Theme state management
│   │   │
│   │   └── lib/
│   │       ├── ai.js                  # LLM integration client-side
│   │       ├── auth.js                # Auth utilities
│   │       └── demo-data.js           # Demo content
│   │
│   ├── public/                         # Static assets
│   └── test_api.js                     # API testing utilities
│
├── test_auth.js                        # Authentication tests
├── .gitignore
└── README.md (this file)
```

---

## 🗄️ Database Overview

### SQL Server Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT NEWID(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  personality_profile JSON,
  twin_trained BIT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
```

#### Chats Table
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT NEWID(),
  user_id UUID NOT NULL FOREIGN KEY REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT,
  chat_mode VARCHAR(50),
  tokens_used INT,
  file_id UUID FOREIGN KEY REFERENCES files(id),
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT NEWID(),
  user_id UUID NOT NULL FOREIGN KEY REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(500),
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  uploaded_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Usage Table
```sql
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT NEWID(),
  user_id UUID NOT NULL FOREIGN KEY REFERENCES users(id),
  tokens_used INT,
  api_calls INT,
  usage_date DATE DEFAULT CAST(GETDATE() AS DATE),
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🤖 LLM Models

### Supported Models

| Model | Provider | Cost | Speed | Context Window |
|-------|----------|------|-------|-----------------|
| **GPT-4o Mini** | OpenAI | $0.15/$0.60 per 1M tokens | Fast | 128K tokens |
| **LLaMA 3.1 70B** | Groq | $0.50/$1.50 per 1M tokens | Very Fast | 128K tokens |
| **Mock Engine** | Built-in | Free | Instant | Unlimited |

### Model Selection Logic

```python
if GROQ_API_KEY:
    use_groq()  # LLaMA 3.1 70B (fastest)
elif OPENAI_API_KEY:
    use_openai()  # GPT-4o Mini (best quality)
else:
    use_mock_engine()  # Demo mode
```

### Configuration

Set environment variables in `.env`:

```env
# OpenAI Setup
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1

# Groq Setup (prioritized if both set)
GROQ_API_KEY=gsk-...
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

### Pricing Comparison

- **OpenAI GPT-4o Mini**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Groq LLaMA**: ~$0.50 per 1M input tokens, $1.50 per 1M output tokens
- **Mock Engine**: Free (for development/demo)

---

## 🔧 Development Guide

### Setting Up Development Environment

#### 1. Install Development Tools
```bash
# Backend
pip install black flake8 pytest

# Frontend
npm install -D eslint prettier
```

#### 2. Code Quality

**Backend Formatting**
```bash
black backend/
flake8 backend/
```

**Frontend Formatting**
```bash
npx prettier --write src/
```

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
```

#### Frontend Tests
```bash
cd frontend
npm run test
```

### Database Migrations

Using SQLAlchemy, migrations are handled automatically on app startup.

To create a new migration manually:
```bash
cd backend
flask db init
flask db migrate
flask db upgrade
```

### Adding New Features

#### Adding a New Route

1. Create route handler in `routes/new_routes.py`
2. Register blueprint in `app.py`
3. Add corresponding model if needed

#### Adding a New API Endpoint

```python
# routes/example_routes.py
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

example_bp = Blueprint('example', __name__, url_prefix='/api/example')

@example_bp.route('/action', methods=['POST'])
@jwt_required()
def perform_action():
    data = request.get_json()
    # Your logic here
    return {'success': True}
```

#### Integrating with Frontend

```javascript
// src/lib/api.js
export const performAction = async (data) => {
  const response = await fetch(`${API_BASE_URL}/example/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/nexus_ai_project.git
cd nexus_ai_project
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes**
- Follow existing code style
- Add/update tests for new functionality
- Update documentation

4. **Commit Changes**
```bash
git add .
git commit -m "feat: brief description of changes"
```

5. **Push to Fork**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request**
- Describe changes clearly
- Reference related issues
- Include test results

### Code Style

**Python**: Follow PEP 8
**JavaScript**: Use Prettier + ESLint

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(chat): add voice input support for chat messages

- Integrated Web Speech API
- Added voice input UI component
- Tests added for voice recognition

Closes #123
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For support:
- 📧 Email: support@nexusai.com
- 🐛 Issues: [GitHub Issues](https://github.com/Nexus-Batch-Heads/nexus_ai_project/issues)
- 📚 Documentation: [Project Wiki](https://github.com/Nexus-Batch-Heads/nexus_ai_project/wiki)

---

## 🎯 Roadmap

### Phase 1: Initial Release ✅
- [x] Digital Twin training
- [x] Life Decision Simulator
- [x] Chat interface with LLM integration
- [x] User authentication

### Phase 2: Enhancements 🚀
- [ ] Advanced personality analysis
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features

### Phase 3: Analytics & Intelligence 🔮
- [ ] Journey tracking dashboard
- [ ] Predictive analytics
- [ ] Integration with third-party services
- [ ] API for external developers

---

**Made with ❤️ by Nexus Batch Heads**

Last updated: March 27, 2026 | Repository: [nexus_ai_project](https://github.com/Nexus-Batch-Heads/nexus_ai_project)
