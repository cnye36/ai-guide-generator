#!/bin/bash

# AI Guide Generator Setup Script
# This script helps set up the project quickly

echo "🚀 Setting up AI Guide Generator..."
echo ""

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm found"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Warning: Node.js version 20 or higher is recommended"
    echo "   Current version: $(node -v)"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build shared package
echo ""
echo "🔨 Building shared package..."
cd packages/shared
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build shared package"
    exit 1
fi

cd ../..
echo "✅ Shared package built"

# Setup backend .env
echo ""
if [ ! -f "packages/backend/.env" ]; then
    echo "📝 Setting up backend environment..."
    cp packages/backend/.env.example packages/backend/.env
    echo "✅ Created packages/backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit packages/backend/.env and add your API keys:"
    echo "   - ANTHROPIC_API_KEY (required)"
    echo "   - BRAVE_API_KEY (required for web search)"
else
    echo "✅ Backend .env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your API keys to packages/backend/.env"
echo "2. Run 'pnpm dev' from the root directory to start both servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"
