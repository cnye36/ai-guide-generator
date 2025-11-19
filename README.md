# 🤖 AI Guide Generator

An intelligent guide and tutorial generator powered by AI that researches topics using web search and creates high-quality, customizable content optimized for blogs and social media.

## ✨ Features

- **AI-Powered Research**: Automatically gathers information from multiple web sources
- **Customizable Output**: Control depth, audience level, style, tone, and length
- **Real-time Generation**: Watch as your guide is created with progress tracking
- **Multiple Export Formats**: Export as Markdown, HTML, or copy to clipboard
- **SEO-Optimized**: Generates content with proper structure and readability
- **Source Citations**: Automatically includes and formats source references
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

This is a monorepo using pnpm workspaces:

```
guide-generator/
├── packages/
│   ├── frontend/         # React + TypeScript + Vite
│   ├── backend/          # Express + TypeScript
│   └── shared/           # Shared types and utilities
```

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- React Markdown (content rendering)
- Axios (API calls)

### Backend
- Node.js with Express
- TypeScript
- Anthropic SDK (Claude AI)
- Brave Search API (web research)
- Zod (validation)

## 📋 Prerequisites

- Node.js 20+ 
- pnpm 8+
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Brave Search API key ([Get one here](https://brave.com/search/api/))

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# Create backend .env file
cd packages/backend
cp .env.example .env
```

Edit `packages/backend/.env` and add your API keys:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Start Development

```bash
# From the root directory, start both frontend and backend:
pnpm dev

# This will start:
# - Backend API on http://localhost:3001
# - Frontend on http://localhost:5173
```

The frontend will automatically proxy API requests to the backend.

## 📖 Usage

1. **Enter a Topic**: Type in what you want to create a guide about
2. **Customize Preferences**: Choose depth, audience, style, length, format, and tone
3. **Generate**: Click "Generate Guide" and wait 30-60 seconds
4. **Export**: Copy markdown or export as HTML

## 🎯 Example Topics

- "React Hooks Best Practices"
- "Introduction to Machine Learning"
- "SEO for Beginners"
- "TypeScript Generics Explained"
- "Docker for Development"

## 🔧 API Endpoints

### POST `/api/generate`
Generate a complete guide

### POST `/api/research`
Research a topic without generating content

### GET `/api/health`
Health check endpoint

## 📝 Development Scripts

```bash
# Root directory
pnpm dev          # Start both frontend and backend
pnpm build        # Build all packages
pnpm clean        # Clean all build artifacts
```

## 📄 License

MIT

---

**Built with ❤️ using React, TypeScript, and Claude AI**
