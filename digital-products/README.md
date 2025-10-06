# Digital Products Hub - The Obsidian Co

This folder contains the digital products sales pages for The Obsidian Co.

## Structure

```
digital-products/
├── index.html                      # Main digital products hub page
├── beauty-ad-vault-pro.html        # Beauty Ad Vault Pro product page
├── saas-lead-gen-masterclass.html  # SaaS Lead Gen Masterclass product page
├── thank-you.html                  # Purchase confirmation page
├── images/                         # Product images and assets
└── netlify/                        # Netlify serverless functions
    └── functions/                  # Payment processing, etc.
```

## Pages Overview

### Main Hub (`index.html`)
- Overview of all digital products
- 6 product cards (3 active, 3 coming soon)
- Trust badges and social proof
- Consistent design with beauty/saas sales pages

### Product Pages
1. **Beauty Ad Vault Pro** - €197 (originally €497)
   - 238+ tested ad creatives
   - 7 proven frameworks
   - Swipe file templates
   - Targeting strategies

2. **SaaS Lead Gen Masterclass** - €297 (originally €697)
   - 6-module video course
   - Complete funnel templates
   - Email sequences
   - Live Q&A sessions

3. **Complete Growth Bundle** - €697 (originally €1,997)
   - All products combined
   - 1-on-1 strategy session
   - Private community access

### Thank You Page
- Purchase confirmation
- Next steps guide
- Support contact information

## Design System

The pages follow The Obsidian Co's brand guidelines:
- **Primary Color**: #3380AB (Blue)
- **Secondary Color**: #6CAA33 (Green)
- **Font**: Inter
- **Style**: Modern, clean, professional
- **Animations**: AOS (Animate On Scroll)

## Features

- ✅ Responsive design (mobile-first)
- ✅ Consistent branding with existing pages
- ✅ SEO optimized
- ✅ Fast loading with optimized assets
- ✅ Accessibility compliant
- ✅ Modern animations

## Integration Notes

### Payment Processing
Currently, CTA buttons show an alert. To integrate payment:
1. Add Stripe/PayPal integration
2. Update CTA button click handlers
3. Set up webhook endpoints in `/netlify/functions/`

### Email Delivery
Set up automated email delivery for:
- Purchase confirmations
- Product access credentials
- Community invitations

### Analytics
Add tracking for:
- Page views
- Product card clicks
- Purchase completions
- Conversion rates

## Deployment

These pages are ready to deploy to Netlify. Simply push to your repository and Netlify will automatically deploy.

### Environment Variables Needed
```
STRIPE_PUBLIC_KEY=your_key_here
STRIPE_SECRET_KEY=your_key_here
EMAIL_API_KEY=your_key_here
```

## TODO
- [ ] Add product images to /images folder
- [ ] Set up payment processing (Stripe recommended)
- [ ] Configure email automation
- [ ] Add analytics tracking
- [ ] Create product delivery system
- [ ] Set up customer portal for access management

## Contact

For questions or support:
- Email: hello@theobsidianco.com
- Website: https://theobsidianco.com
