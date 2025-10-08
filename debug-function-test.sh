#!/bin/bash

# Direct test of the Netlify function to get detailed error info
# Replace YOUR_SITE_URL with your actual Netlify site URL

echo "🧪 Testing ecom checklist function directly..."

# Test data
TEST_DATA='{
  "email": "debug-test@example.com",
  "firstName": "Debug Test", 
  "website": "https://test.com",
  "utm_source": "debug",
  "utm_medium": "test",
  "utm_campaign": "direct-test",
  "landing_path": "/ecom-checklist/"
}'

echo "📡 Calling debug function..."
echo "Data: $TEST_DATA"
echo ""

# Replace this URL with your actual Netlify site URL
SITE_URL="https://your-site-name.netlify.app"

curl -v -X POST \
  "$SITE_URL/.netlify/functions/submit-ecom-debug" \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA"

echo -e "\n\n✅ Test completed. Check the detailed response above."
echo "Look for specific error messages about database, permissions, or configuration."