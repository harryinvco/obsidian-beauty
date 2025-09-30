# Deployment Instructions for Netlify

## Environment Variables Setup

### Required Environment Variables

Add these environment variables in Netlify Dashboard:
1. Go to **Site Settings** → **Environment Variables**
2. Add the following variables:

```
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
```

### Deployment Settings

- **Build command**: `cd beauty && npm install`
- **Publish directory**: `beauty`
- **Functions directory**: `beauty/netlify/functions`

### Available Routes

After deployment, your site will have:
- `/` - Beauty lead magnet page (main page)
- `/beauty` - Same as root
- `/saas` - SaaS B2B lead generation page
- `/thank-you` - Beauty thank you page
- `/saas/thank-you` - SaaS thank you page

### Database Setup

Run the SQL script in `beauty/saas/create_saas_leads_table.sql` in your Supabase dashboard to create the required `saas_leads` table.

### Testing

After deployment:
1. Test the beauty form submission at `/`
2. Test the SaaS form submission at `/saas`
3. Verify emails are being sent via Resend
4. Check Supabase dashboard for new lead entries

## Important Security Note

- Never commit actual API keys to Git
- Always use environment variables for sensitive data
- The `.env.example` file shows the structure without real values