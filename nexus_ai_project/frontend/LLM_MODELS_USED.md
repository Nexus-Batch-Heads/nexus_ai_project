# LLMs Used in Nexus AI

## Models Overview

| # | Model Name | Provider | Model ID | Usage |
|---|---|---|---|---|
| 1 | **GPT-4o Mini** | OpenAI | `gpt-4o-mini` | Default model for simulations & chat when `OPENAI_API_KEY` is set |
| 2 | **LLaMA 3.1 70B Versatile** | Groq | `llama-3.1-70b-versatile` | Alternative model when `GROQ_API_KEY` is set (takes priority over OpenAI) |
| 3 | **Built-in Mock AI Engine** | Internal | N/A | Realistic simulated responses when no API keys are configured |

## Model Selection Logic

```
IF GROQ_API_KEY is set
  → Use Groq API with LLaMA 3.1 70B Versatile
ELSE IF OPENAI_API_KEY is set
  → Use OpenAI API with GPT-4o Mini
ELSE
  → Use Built-in Mock AI Engine (demo mode)
```

## Configuration

Set the following environment variables in `.env.local`:

```env
# Option 1: OpenAI
OPENAI_API_KEY=your-openai-key
OPENAI_BASE_URL=https://api.openai.com/v1

# Option 2: Groq (prioritized if both are set)
GROQ_API_KEY=your-groq-key
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

## Where Models Are Used

| Feature | Purpose |
|---|---|
| Life Decision Simulator | Generates 3–5 future scenarios with risks, rewards, and alignment scores |
| AI Chat – "Advise Me" mode | Provides personalized life advice based on user's personality profile |
| AI Chat – "Talk as Me" mode | Mimics user's communication style, tone, and values |

## Extending to Other Models

The app uses the OpenAI-compatible API format, so any provider with a compatible endpoint works:

- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo
- **Groq**: LLaMA 3.1, Mixtral, Gemma
- **Together AI**: Various open-source models
- **Ollama (local)**: Any locally hosted model
- **Any OpenAI-compatible API**

To switch models, update the `model` field in `src/lib/ai.js`.

---

*Generated for Nexus AI – Your Digital Twin & Life Decision Simulator*
