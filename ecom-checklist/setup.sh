#!/bin/bash

# Supabase & Resend Setup Script for eCom Checklist
# This script helps you set up the database and environment variables

echo "🚀 Setting up eCom Checklist Lead Capture System..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 SETUP CHECKLIST:${NC}"
echo ""

echo -e "${YELLOW}1. SUPABASE SETUP${NC}"
echo "   □ Create a new Supabase project at https://supabase.com"
echo "   □ Copy your project URL and service role key"
echo "   □ Run the SQL script to create the ecom_leads table"
echo ""

echo -e "${YELLOW}2. RESEND SETUP${NC}"
echo "   □ Create account at https://resend.com"
echo "   □ Get your API key from the dashboard"
echo "   □ Verify your domain (mike@theobsidianco.com)"
echo ""

echo -e "${YELLOW}3. NETLIFY ENVIRONMENT VARIABLES${NC}"
echo "   □ Go to Netlify Dashboard > Site Settings > Environment Variables"
echo "   □ Add the following variables:"
echo ""

# Check if .env exists and show current values
if [ -f ".env" ]; then
    echo -e "${GREEN}Found .env file with these values:${NC}"
    echo "SUPABASE_URL=$(grep SUPABASE_URL .env 2>/dev/null || echo 'NOT SET')"
    echo "SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env 2>/dev/null || echo 'NOT SET')"
    echo "RESEND_API_KEY=$(grep RESEND_API_KEY .env 2>/dev/null || echo 'NOT SET')"
    echo ""
    echo -e "${RED}⚠️  Remember: Don't commit .env to Git! Set these in Netlify Dashboard instead.${NC}"
else
    echo -e "${YELLOW}Variables needed:${NC}"
    echo "SUPABASE_URL=your_supabase_project_url"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    echo "RESEND_API_KEY=your_resend_api_key"
fi

echo ""
echo -e "${YELLOW}4. DATABASE TABLE CREATION${NC}"
echo "   □ Copy the SQL from create_ecom_leads_table.sql"
echo "   □ Run it in Supabase SQL Editor"
echo ""

echo -e "${BLUE}📊 WHAT THIS SYSTEM CAPTURES:${NC}"
echo "   ✅ Email & First Name (required)"
echo "   ✅ Website URL (optional)"
echo "   ✅ UTM tracking parameters"
echo "   ✅ IP address & User agent"
echo "   ✅ Landing page path"
echo "   ✅ Timestamp"
echo ""

echo -e "${BLUE}📧 EMAIL FEATURES:${NC}"
echo "   ✅ Beautiful HTML email template"
echo "   ✅ Personalized with first name"
echo "   ✅ Direct link to Notion checklist"
echo "   ✅ CTA for booking strategy calls"
echo "   ✅ Fallback text version"
echo ""

echo -e "${GREEN}🎯 NEXT STEPS:${NC}"
echo "1. Create your Supabase project and run the SQL script"
echo "2. Set up Resend account and verify your domain"
echo "3. Add environment variables to Netlify"
echo "4. Test the form submission"
echo "5. Check Supabase dashboard for new leads"
echo ""

echo -e "${BLUE}💡 TESTING:${NC}"
echo "Test the form locally with: netlify dev"
echo "Check Supabase logs for any connection issues"
echo "Verify emails are being sent through Resend dashboard"
echo ""

echo -e "${GREEN}✨ System is ready to capture leads!${NC}"