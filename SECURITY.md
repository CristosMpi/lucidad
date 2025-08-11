# 🔐 Security Configuration Guide

## Setting Up Your OpenAI API Key Securely

### ⚠️ IMPORTANT: Never commit API keys to version control!

Your API key: `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`

### Step 1: Create Environment File

Create a file named `.env.local` in your project root:

```bash
# On Windows (PowerShell)
New-Item -Path ".env.local" -ItemType File

# On macOS/Linux
touch .env.local
```

### Step 2: Add Your API Key

Open `.env.local` and add:

```env
OPENAI_API_KEY=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
OPENAI_VISION_MODEL=gpt-4o
NODE_ENV=development
```

### Step 3: Verify .gitignore

Make sure your `.gitignore` file includes:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# API keys
*.key
*.pem
```

### Step 4: Test Configuration

Restart your development server:

```bash
npm run dev
# or
yarn dev
```

## 🔒 Security Best Practices

1. **Never share your API key publicly**
2. **Use different keys for development and production**
3. **Rotate keys regularly**
4. **Monitor API usage in OpenAI dashboard**
5. **Set up rate limiting (already configured in the app)**

## 🚨 If Your Key is Compromised

1. **Immediately revoke the key in OpenAI dashboard**
2. **Generate a new key**
3. **Update your .env.local file**
4. **Check for unauthorized usage**

## 📱 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key |
| `OPENAI_VISION_MODEL` | ❌ | Vision model (default: gpt-4o) |
| `NODE_ENV` | ❌ | Environment (development/production) |

## 🔍 Verification

To verify your setup is working:

1. Check that the app loads without errors
2. Try uploading an image for analysis
3. Check browser console for any API-related errors
4. Verify in OpenAI dashboard that requests are being made

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have sufficient OpenAI credits
4. Check OpenAI service status

---

**Remember: Security is everyone's responsibility! 🔐**
