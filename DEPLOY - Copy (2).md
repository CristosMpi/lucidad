# 🚀 Deploy to Netlify

## Quick Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local` file with your OpenAI API key:
```env
OPENAI_API_KEY=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
```

### 3. Test Locally
```bash
npm run dev
```

### 4. Deploy to Netlify

#### Option A: Netlify CLI (Recommended)
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
npm run deploy
```

#### Option B: Netlify Dashboard
1. Push code to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `out`
5. Add environment variables in Netlify dashboard

### 5. Environment Variables in Netlify
Add these in Netlify dashboard → Site settings → Environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: `production`

## Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Export static files
npm run export

# Deploy to Netlify
npm run deploy
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (18+ required)
2. **API errors**: Verify environment variables
3. **Image upload fails**: Check file size limits
4. **CORS issues**: Ensure proper headers in netlify.toml

### Support:
- Check browser console for errors
- Verify API key is valid
- Ensure sufficient OpenAI credits
- Check Netlify build logs

## Performance Tips

- Images are optimized automatically
- Static export ensures fast loading
- CDN distribution via Netlify
- Automatic HTTPS enabled

---

**Your app will be available at: `https://your-site-name.netlify.app`**
