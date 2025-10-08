# BEAUTY PAGE FIX - Quick Setup

## 🚨 Most Likely Issues:

### 1. **beauty_leads table doesn't exist**
Run this SQL in Supabase SQL Editor:
```sql
-- Create beauty_leads table
CREATE TABLE IF NOT EXISTS beauty_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100), 
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE Row Level Security
ALTER TABLE beauty_leads DISABLE ROW LEVEL SECURITY;

-- Give service role full access
GRANT ALL PRIVILEGES ON beauty_leads TO service_role;
GRANT ALL PRIVILEGES ON SEQUENCE beauty_leads_id_seq TO service_role;
```

### 2. **Environment variables not set in Netlify**
In Netlify Dashboard → Site Settings → Environment Variables:
- `SUPABASE_URL` = `https://legzoryphvodcovbzxpb.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ3pvcnlwaHZvZGNvdmJ6eHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkxMTg2NCwiZXhwIjoyMDc1NDg3ODY0fQ.agkiCIcPh_dv0hygudT0yAZJ2Fh2J83M6QbcyZ7nc1Y`

Then trigger a new deployment.

## 🧪 Test Steps:
1. Set environment variables (if not already done)
2. Create beauty_leads table  
3. Submit beauty form
4. Check browser console for detailed debug info
5. The debug function will tell you exactly what's wrong

## 📱 Expected Results:
- **Before fix**: "submission failed" or 500 error
- **After fix**: "Beauty lead saved successfully!"