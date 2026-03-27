# Nexus AI – Your Digital Twin & Life Decision Simulator

> Your AI clone helping you choose your future.

A futuristic web app combining a Digital Twin AI that mimics the user with a Life Decision Simulator that predicts outcomes of choices.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🔑 Demo Login

The app works instantly with no setup required:

- **Email**: `demo@nexus.ai`  
- **Password**: `demo123`

The demo account comes pre-loaded with:
- Trained AI twin personality
- 3 sample simulations (career, financial, lifestyle)
- Chat history

## ✨ Features

### 🧬 Digital Twin Creation
- Personality quiz (risk tolerance, communication style, values)
- Chat-based training
- Voice input (Web Speech API)
- Animated AI avatar

### 🔮 Life Decision Simulator
- Input any life decision
- Get 3-5 AI-powered future scenarios
- Visual decision tree
- Risk/reward analysis
- Personalized "Best Path" recommendation

### 💬 AI Chat Interface
- **"Advise Me"** mode – Get personalized life advice
- **"Talk as Me"** mode – Your twin responds as you would
- Voice input & text-to-speech
- File upload support (images, PDFs, text files)
- Message history

### 🎯 Personalized Predictions
- Scenarios tailored to your personality profile
- Risk tolerance alignment scoring
- Values-based recommendations

### 🎨 Theme System
- Light Mode / Dark Mode / System Default
- Smooth transition animations
- Persisted user preference

## ⚙️ Configuration

Copy `.env.example` to `.env.local` and configure:

```env
# Optional - AI API key for real AI responses (works without it)
OPENAI_API_KEY=your-key-here

# Alternative - Groq API
GROQ_API_KEY=your-key-here

# JWT Secret (change in production)
JWT_SECRET=your-secret-here
```

**Without API keys**: The app runs in demo mode with realistic mock AI responses.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **AI**: OpenAI / Groq compatible (with mock fallback)
- **Auth**: JWT + bcryptjs
- **Speech**: Web Speech API (browser-native)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── login/page.js        
│   ├── signup/page.js       
│   ├── dashboard/page.js    
│   ├── twin/page.js         # Twin training
│   ├── simulator/page.js    # Decision simulator
│   ├── chat/page.js         # AI chat
│   └── api/                 # Backend API routes
├── components/
│   ├── layout/Navbar.js     
│   └── avatar/AnimatedAvatar.js
├── context/
│   ├── AuthContext.js
│   └── ThemeContext.js       
└── lib/
    ├── auth.js              # JWT helpers
    ├── ai.js                # AI integration
    └── demo-data.js         # In-memory store + demo data
```
