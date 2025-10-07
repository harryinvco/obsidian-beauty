# Obsidian Sales Pages - Deployment Structure

## Overview
Clean, logical folder structure with centralized Netlify functions and shared Supabase database using separate tables for each product/service.

## New Folder Structure
```
/
├── index.html (hub page - main landing)
├── beauty/
│   ├── index.html (beauty ad vault)
│   ├── thank-you.html
│   └── images/
├── saas/
│   ├── index.html (saas lead gen)
│   └── thank-you.html
├── ecom-checklist/
│   ├── index.html (ecom checklist)
│   └── thank-you.html
├── digital-products/ (dev only)
└── netlify/functions/ (centralized)
```

## Active Pages
- **Hub Page**: `offers.theobsidianco.com/` → `/index.html`
- **Beauty Ad Vault**: `offers.theobsidianco.com/beauty` → `/beauty/index.html` (ACTIVE & CAPTURING LEADS)

## Placeholder Pages (Ready but not capturing leads)
- **SaaS Lead Gen**: `offers.theobsidianco.com/saas` → `/saas/index.html`
- **Ecom Checklist**: `offers.theobsidianco.com/ecom-checklist` → `/ecom-checklist/index.html`

## Hidden/Development Pages
- **Digital Products**: `/digital-products/*` → Blocked in production, accessible in dev/preview only

## Functions Structure

### Centralized Location
All Netlify functions are now in `/netlify/functions/`

### Active Functions
- `submit.js` → Handles beauty page submissions → `beauty_leads` table
- `submit-saas.js` → Handles SaaS submissions (DISABLED, returns success message)
- `submit-ecom.js` → Handles ecom-checklist submissions (DISABLED, returns success message)

### Database Tables
Each sales page uses its own Supabase table:
- Beauty: `beauty_leads`
- SaaS: `saas_leads` (ready, not active)
- Ecom: `ecom_leads` (ready, not active)

## Environment Variables Required
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key (optional, for emails)
```

## Deployment Configuration

### netlify.toml
```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

### Key Features
1. **Single Supabase Instance**: All pages share the same Supabase project
2. **Separate Tables**: Each product has its own leads table
3. **Centralized Functions**: All form submissions go through `/netlify/functions/`
4. **Development Safety**: Digital products are hidden in production
5. **Ready for Activation**: SaaS and ecom functions are ready to be enabled

## To Activate SaaS or Ecom Pages

1. In the respective function (`submit-saas.js` or `submit-ecom.js`):
   - Remove the "TEMPORARILY DISABLED" section
   - Uncomment the actual database insertion code
   - Add email templates if needed

2. Update the success message in the function

3. Test thoroughly before going live

## Database Setup
Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor to create all required tables and indexes.

## Current Status
✅ Beauty page: Fully functional, capturing leads  
🔄 SaaS page: Form works, returns placeholder message  
🔄 Ecom page: Form works, returns placeholder message  
❌ Digital products: Hidden in production  

## Testing
- Beauty submissions should save to `beauty_leads` table
- SaaS/Ecom submissions should return success without saving (until activated)
- Digital products should be inaccessible on production domain