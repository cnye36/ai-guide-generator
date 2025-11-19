# Quick Start Guide 🚀

Get your AI Guide Generator up and running in 5 minutes!

## Prerequisites

- Node.js 20+
- pnpm 8+
- [Anthropic API key](https://console.anthropic.com/)
- [Brave Search API key](https://brave.com/search/api/) (optional but recommended)

## Installation

### Option 1: Automated Setup (Recommended)

```bash
cd guide-generator
./setup.sh
```

Then edit `packages/backend/.env` with your API keys.

### Option 2: Manual Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Build shared package
cd packages/shared
pnpm build
cd ../..

# 3. Configure backend
cd packages/backend
cp .env.example .env
# Edit .env and add your API keys
cd ../..
```

## Running the App

From the root directory:

```bash
pnpm dev
```

This starts both the backend (port 3001) and frontend (port 3000).

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Guide

1. Enter a topic: "Getting Started with Docker"
2. Leave preferences as default or customize
3. Click "Generate Guide"
4. Wait 30-60 seconds for your guide!

## Troubleshooting

### "ANTHROPIC_API_KEY not set"
- Edit `packages/backend/.env`
- Add: `ANTHROPIC_API_KEY=sk-ant-...`

### "No research results found"
- Add Brave Search API key to `.env`
- Or continue without it (will use fallback)

### Port already in use
- Change ports in:
  - `packages/backend/.env` (PORT=3001)
  - `packages/frontend/vite.config.ts` (port: 3000)

## What's Next?

- Check out the full [README.md](./README.md) for detailed documentation
- Customize guide preferences
- Export guides as Markdown
- Use SEO metadata and social snippets

---

**Need help?** See [README.md](./README.md) for more details!
