# Environment Variables Setup Guide

## Required Environment Variables

The ecom checklist and other forms require the following environment variables to be set in your Netlify dashboard:

### Supabase Configuration
1. `SUPABASE_URL` - Your Supabase project URL
   - Found in: Supabase Dashboard → Settings → API → Project URL
   - Example: `https://your-project-ref.supabase.co`

2. `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - Found in: Supabase Dashboard → Settings → API → Service Role Key (secret)
   - **Important**: Use the service_role key, not the anon key

### Email Configuration  
3. `RESEND_API_KEY` - Your Resend API key for sending emails
   - Get from: Resend Dashboard → API Keys
   - Example: `re_xxxxxxxxxx`

## How to Set Environment Variables in Netlify

1. Go to your Netlify Dashboard
2. Select your site (obsidian-beauty)
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add a variable** for each of the above
5. Enter the key name and value
6. Click **Create variable**
7. **Important**: Redeploy your site after adding variables

## Testing the Setup

1. Temporarily switch to debug mode in forms (already done for ecom-checklist)
2. Submit a test form
3. Check browser console for detailed error messages
4. Check Netlify function logs for server-side errors

## Database Setup

Make sure your Supabase database has the required tables:
- `ecom_leads` - for ecom checklist submissions
- `fashion_leads` - for fashion page submissions  
- `saas_leads` - for SaaS page submissions

Run the create table SQL scripts if tables don't exist:
- `/ecom-checklist/create_ecom_leads_table.sql`
- `/fashion/create_fashion_leads_table.sql` 
- `/saas/create_saas_leads_table.sql`