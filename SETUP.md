# Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Get API Keys

1. **Anthropic API Key**: 
   - Go to https://console.anthropic.com/
   - Sign up/login
   - Create a new API key
   - Copy it

2. **Brave Search API Key**:
   - Go to https://brave.com/search/api/
   - Sign up for free tier (2,000 queries/month free)
   - Get your API key
   - Copy it

### Step 2: Install Dependencies

```bash
cd guide-generator
pnpm install
```

### Step 3: Configure Environment

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` file:
```env
ANTHROPIC_API_KEY=sk-ant-xxxx...  # Paste your Anthropic key here
BRAVE_SEARCH_API_KEY=BSA...       # Paste your Brave key here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Start the App

```bash
# Go back to root directory
cd ../..

# Start both frontend and backend
pnpm dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend on http://localhost:5173

### Step 5: Use the App

1. Open http://localhost:5173 in your browser
2. Enter a topic (e.g., "React State Management")
3. Customize preferences
4. Click "Generate Guide"
5. Wait 30-60 seconds
6. Export your guide!

## 🎯 Test It Works

Try generating a guide with these settings:
- **Topic**: "Introduction to Docker"
- **Depth**: Standard
- **Audience**: Beginner
- **Style**: Tutorial
- **Length**: Medium

You should get a comprehensive guide in about 45 seconds.

## ❓ Troubleshooting

### "Missing required environment variables"
- Make sure you created the `.env` file in `packages/backend/`
- Check that both API keys are set
- No spaces around the `=` sign

### "Port already in use"
- Change PORT in `.env` to something else (e.g., 3002)
- Or kill the process using the port

### "Failed to generate guide"
- Check your API keys are valid
- Verify you have API credits (Anthropic)
- Check Brave Search API quota

### Frontend won't connect to backend
- Make sure backend is running (check terminal)
- Verify CORS_ORIGIN matches frontend URL
- Try refreshing the page

## 📊 Cost Estimates

**Per Guide Generation:**
- Anthropic API: ~$0.10-0.30 (depending on length)
- Brave Search: Free (up to 2,000/month)

**Monthly (100 guides):**
- ~$10-30 in API costs

## 🚀 Next Steps

1. **Customize for your needs**: Edit prompts in `content-generation.service.ts`
2. **Add more features**: See README for ideas
3. **Deploy**: Use Railway/Render for backend, Vercel for frontend
4. **Integrate with AffinityBots**: Use as a workflow template

## 💡 Pro Tips

- Use specific topics for better results
- Adjust depth based on topic complexity
- Test different tones for your audience
- Save generated guides as templates
- Batch generate guides during off-peak hours for lower API costs
