# CRITICAL FIX: Environment Variables Setup

## 🚨 MUST DO: Set Environment Variables in Netlify

The 500 Internal Server Error means your Netlify functions can't access Supabase because environment variables aren't set.

### Exact Steps:

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Select your site**: obsidian-beauty (or whatever it's named)
3. **Navigate**: Site Settings → Environment Variables
4. **Add these EXACT variables**:

   **Variable 1:**
   - Key: `SUPABASE_URL`
   - Value: `https://legzoryphvodcovbzxpb.supabase.co`

   **Variable 2:** 
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ3pvcnlwaHZvZGNvdmJ6eHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkxMTg2NCwiZXhwIjoyMDc1NDg3ODY0fQ.agkiCIcPh_dv0hygudT0yAZJ2Fh2J83M6QbcyZ7nc1Y`

   **Variable 3 (Optional for now):**
   - Key: `RESEND_API_KEY` 
   - Value: `your_resend_api_key_if_you_have_one`

5. **CRITICAL**: After adding variables, go to Deploys tab and click "Trigger deploy"

### Why This Fixes the Issue:
- 500 error = server can't access database
- Missing env vars = no database connection
- Adding vars + redeploy = working form

## Next: Create Database Table (if needed)