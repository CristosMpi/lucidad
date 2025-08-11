#!/bin/bash

echo "🚀 Deploying LucidAd to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=out

echo "✅ Deployment complete!"
echo "🌍 Your app is now live on Netlify!"
echo "🔑 Don't forget to set your OPENAI_API_KEY in Netlify dashboard"
