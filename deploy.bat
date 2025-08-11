@echo off
echo 🚀 Deploying LucidAd to Netlify...

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Netlify CLI not found. Installing...
    npm install -g netlify-cli
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Deploy to Netlify
echo 🌐 Deploying to Netlify...
netlify deploy --prod --dir=out

echo ✅ Deployment complete!
echo 🌍 Your app is now live on Netlify!
echo 🔑 Don't forget to set your OPENAI_API_KEY in Netlify dashboard
pause
