# VioraAI — Next-Generation AI Assistant

> **Hackathon Submission · Problem Statement 4: Next-Generation AI Assistants**

VioraAI is a context-aware, multi-domain AI assistant platform powered by **Google Gemini API** — built for education, business, and everyday productivity.

🔗 **Live Demo:** [vioraai-two.vercel.app/welcome](https://vioraai-two.vercel.app/welcome)

---

## 🧠 Problem Statement

Existing AI tools lack:
- **Contextual understanding** — conversations feel disconnected and stateless
- **Adaptability** — rigid responses that ignore user intent or domain
- **Accessibility** — interfaces too complex for non-technical users
- **Workflow integration** — single-purpose tools that can't chain actions

## 💡 Solution — VioraAI

VioraAI closes this gap with a fluid, intelligent assistant that:
- Maintains **full conversational context** across every message
- **Adapts its tone and format** based on query type (academic, casual, business)
- Streams responses **in real time** for a natural, human-like feel
- Runs on a **zero-friction UI** accessible to all users

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 Contextual AI Chat | Multi-turn conversations with full session memory via Gemini |
| ⚡ Real-Time Streaming | Token-by-token response streaming for instant feedback |
| 🎨 Clean UI | shadcn/ui + Tailwind CSS — responsive on mobile and desktop |
| 🌐 Multi-Domain | Education, business, and everyday use in one assistant |
| 🚪 Welcome Onboarding | Smooth `/welcome` screen for first-time users |
| 🔧 TypeScript | Fully typed codebase for reliability and scalability |

---

## 🤖 Google AI Usage

### Tools / Models Used
- **Google Gemini API** — core language model
- **Gemini Flash / Pro** — optimised for fast multi-turn dialogue
- **Google AI Studio** — prompt engineering and API key management

### How AI Is Integrated
1. **Conversational Engine** — Full chat history is passed to Gemini on every request, enabling coherent multi-turn understanding
2. **System Prompt Layer** — A carefully engineered system prompt defines VioraAI's persona, tone, and behaviour
3. **Streaming Responses** — Uses Gemini's streaming API so users see answers forming in real time
4. **Adaptive Intelligence** — Gemini self-selects response format (bullets, prose, structured) based on query context

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| AI Model | Google Gemini API |
| Package Manager | Bun / npm |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A Google Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/AbhiramJayaraj/adoapps-main-main.git
cd adoapps-main-main

# 2. Install dependencies
npm install
# or
bun install

# 3. Set up environment variables
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env

# 4. Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
adoapps-main-main/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (shadcn/ui)
│   ├── pages/               # Route-level components
│   │   ├── Welcome.tsx      # Onboarding screen (/welcome)
│   │   └── Assistant.tsx    # Main AI chat interface
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions & Gemini API helpers
│   └── main.tsx             # App entry point
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🌍 Deployment

VioraAI is deployed on **Vercel** with zero-config CI/CD.

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on every push.

---

## 🧪 Use Cases

- 📚 **Education** — Step-by-step explanations, concept breakdowns, homework assistance
- 💼 **Business** — Email drafting, document summaries, brainstorming, decision support
- 🏠 **Everyday** — Quick answers, recommendations, writing help, general knowledge

---

## 📄 License

MIT License — open source and free to use.

---

<div align="center">
  Built with React · TypeScript · Tailwind CSS · Google Gemini API<br>
  <strong>VioraAI — Hackathon Submission, Problem Statement 4</strong>
</div>
