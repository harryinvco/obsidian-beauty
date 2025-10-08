# Test Environment Setup

## ⚠️ SECURITY WARNING
Never hardcode API keys or secrets in your code files!

## Local Testing Setup

1. Create a `.env` file in the project root (this file is gitignored):
```bash
cp .env.example .env
```

2. Edit `.env` with your actual values:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
RESEND_API_KEY=your_actual_resend_key
```

3. Run tests using environment variables:
```bash
# Load environment variables and run test
source .env && node ecom-checklist/test-simple.js
```

## Production Deployment

Set environment variables in Netlify Dashboard:
- Go to Site Settings → Environment Variables  
- Add each variable individually
- Never commit the actual values to Git

## What NOT to do:
❌ Hardcode secrets in .js files
❌ Commit .env files 
❌ Share API keys in chat/email
❌ Use real keys in public repositories

## What TO do:
✅ Use environment variables
✅ Use .env files locally (gitignored)
✅ Set env vars in Netlify dashboard for production
✅ Rotate keys if they're ever exposed