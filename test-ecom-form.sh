#!/bin/bash

# Test script to verify ecom checklist form submission
# Usage: ./test-ecom-form.sh

echo "🧪 Testing ecom checklist form submission..."

# Test data
TEST_DATA='{
  "email": "test@example.com",
  "firstName": "Test User", 
  "website": "https://example.com",
  "utm_source": "test",
  "utm_medium": "script",
  "utm_campaign": "validation",
  "landing_path": "/ecom-checklist/"
}'

# Test against debug endpoint first
echo "📡 Testing debug endpoint..."
curl -X POST \
  https://your-netlify-site.netlify.app/.netlify/functions/submit-ecom-debug \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA"

echo -e "\n\n📡 Testing production endpoint..."
curl -X POST \
  https://your-netlify-site.netlify.app/.netlify/functions/submit-ecom \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA"

echo -e "\n\n✅ Test completed. Check the responses above for any error messages."
echo "If you see 'Server configuration error', the environment variables are not set."
echo "If you see 'Failed to save your information', there may be database issues."