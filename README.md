# Obsidian Co - Sales Funnel Infrastructure

This repository contains the sales funnels for The Obsidian Co, hosted on `offers.theobsidianco.com`.

## 🏗️ Structure

```
obsidian-beauty/
├── beauty/                    # Beauty industry funnel
│   ├── index.html            # Landing page
│   └── thank-you.html        # Thank you page
├── fashion/                   # Fashion industry funnel
│   ├── index.html            # Landing page
│   └── thank-you.html        # Thank you page
├── saas/                      # SaaS funnel
│   ├── index.html            # Landing page
│   └── thank-you.html        # Thank you page
├── ecommerce/                 # eCommerce service funnel
│   ├── index.html            # Landing page
│   └── thank-you.html        # Thank you page
├── ecom-checklist/            # eCommerce checklist funnel
│   ├── index.html            # Landing page
│   └── thank-you.html        # Thank you page
├── netlify/
│   └── functions/             # Serverless functions
│       ├── submit-beauty.js
│       ├── submit-fashion.js
│       ├── submit-saas.js
│       ├── submit-ecom.js
│       ├── fashion-email-template.js
│       ├── saas-email-template.js
│       └── ecom-email-template.js
├── database/                  # SQL table definitions
│   ├── create_saas_leads_table.sql
│   ├── create_fashion_leads_table.sql
│   └── create_ecom_leads_table.sql
└── netlify.toml              # Netlify configuration
```

## 🎯 Funnels

Each funnel consists of:
1. **Landing Page** (`index.html`) - Captures lead information
2. **Thank You Page** (`thank-you.html`) - Confirmation after submission
3. **Netlify Function** - Handles form submissions
4. **Email Template** - Sends lead magnet via Resend
5. **Supabase Table** - Stores lead data

### Available Funnels

| Funnel | Path | Function | Table | Purpose |
|--------|------|----------|-------|---------|
| Beauty | `/beauty` | `submit-beauty.js` | `beauty_leads` | Beauty industry resources |
| Fashion | `/fashion` | `submit-fashion.js` | `fashion_leads` | Fashion campaign framework |
| SaaS | `/saas` | `submit-saas.js` | `saas_leads` | B2B lead generation blueprint |
| eCommerce Service | `/ecommerce` | - | - | Strategy session booking (Calendly) |
| eCommerce Checklist | `/ecom-checklist` | `submit-ecom.js` | `ecom_leads` | Growth leak checklist |

## 🔧 Technical Stack

- **Hosting**: Netlify
- **Functions**: Netlify Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Forms**: HTML forms with JavaScript submission

## 📧 Email Flow

1. User fills out form on landing page
2. Form submits to Netlify function (`/submit-{funnel}`)
3. Function validates data and saves to Supabase
4. Function sends email with lead magnet via Resend
5. User redirected to thank-you page

### Email Templates

Email templates are modularized in separate files:
- `fashion-email-template.js` - Fashion funnel emails
- `saas-email-template.js` - SaaS funnel emails
- `ecom-email-template.js` - eCommerce funnel emails

Each template module exports:
- `render{Funnel}Email()` - Returns HTML email
- `get{Funnel}EmailText()` - Returns plain text version

## 🗄️ Database Schema

All SQL table creation scripts are in `/database/`:

### Common Fields (All Tables)
- `id` - UUID primary key
- `email` - Unique email address
- `first_name` - First name
- `website` - Optional website URL
- `utm_*` - UTM tracking parameters
- `landing_path` - Landing page path
- `created_at` - Timestamp

### Funnel-Specific Fields

**Fashion (`fashion_leads`)**:
- `ad_spend` - Monthly ad spend
- `monthly_revenue` - Monthly revenue
- `growth_challenge` - Growth challenge description

**SaaS (`saas_leads`)**:
- `ad_spend` - Monthly ad spend

**eCommerce (`ecom_leads`)**:
- `ip_address` - Client IP
- `user_agent` - Browser user agent

## 🔐 Environment Variables

Required environment variables (set in Netlify):

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

## 🚀 Deployment

The site automatically deploys to Netlify on push to `main`:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 📊 Analytics

Each funnel tracks:
- UTM parameters (source, medium, campaign, term, content)
- Landing path
- Client IP (ecom only)
- User agent (ecom only)

## 🧹 Maintenance

### Adding a New Funnel

1. Create folder: `/{funnel-name}/`
2. Add `index.html` and `thank-you.html`
3. Create Netlify function: `netlify/functions/submit-{funnel}.js`
4. Create email template: `netlify/functions/{funnel}-email-template.js`
5. Create Supabase table: `database/create_{funnel}_leads_table.sql`
6. Update `netlify.toml` with redirects
7. Set up email template in Resend

### Email Template Structure

```javascript
function get{Funnel}EmailTemplate() {
  return `<!DOCTYPE html>
    <!-- Full HTML email template -->
  `;
}

function render{Funnel}Email() {
  return get{Funnel}EmailTemplate();
}

function get{Funnel}EmailText() {
  return `Plain text version`;
}

module.exports = {
  render{Funnel}Email,
  get{Funnel}EmailText
};
```

## 🐛 Debugging

Check Netlify Function logs:
```bash
netlify functions:log
```

Test locally:
```bash
netlify dev
```

## 📝 Notes

- All functions use CORS headers for cross-origin requests
- Email sending is non-blocking (won't fail submission if email fails)
- Duplicate emails return 409 status
- All emails are lowercased and trimmed before storage
- Fashion funnel requires work email (blocks Gmail, Yahoo, etc.)

## 🔗 Links

- Live Site: https://offers.theobsidianco.com
- Netlify Dashboard: [Your Netlify URL]
- Supabase Dashboard: [Your Supabase URL]
- Resend Dashboard: https://resend.com/dashboard

---

**Last Updated**: 2025-11-04
**Maintained by**: The Obsidian Co
