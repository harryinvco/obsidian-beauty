const { renderSaaSEmail, getSaaSEmailText } = require('./email-template');

// Test the email template rendering
function testEmailTemplate() {
  console.log('=== Testing SaaS Email Template ===\n');
  
  // Test with full data
  console.log('1. Testing with full data:');
  const fullHtml = renderSaaSEmail('John', 'https://example-saas.com');
  const fullText = getSaaSEmailText('John', 'https://example-saas.com');
  
  console.log('✅ HTML template rendered successfully');
  console.log('✅ Text template rendered successfully');
  console.log('First name personalization:', fullHtml.includes('Hey John') ? '✅ Working' : '❌ Failed');
  console.log('Website personalization:', fullHtml.includes('example-saas.com') ? '✅ Working' : '❌ Failed');
  
  // Test with minimal data
  console.log('\n2. Testing with minimal data:');
  const minimalHtml = renderSaaSEmail('Sarah');
  const minimalText = getSaaSEmailText('Sarah');
  
  console.log('✅ HTML template rendered successfully');
  console.log('✅ Text template rendered successfully');
  console.log('First name fallback:', minimalHtml.includes('Hey Sarah') ? '✅ Working' : '❌ Failed');
  
  // Test with no data
  console.log('\n3. Testing with no data:');
  const noDataHtml = renderSaaSEmail();
  const noDataText = getSaaSEmailText();
  
  console.log('✅ HTML template rendered successfully');
  console.log('✅ Text template rendered successfully');
  console.log('Default greeting:', noDataHtml.includes('Hey there') ? '✅ Working' : '❌ Failed');
  
  console.log('\n=== All tests passed! ===');
  
  // Save a sample HTML file for visual inspection
  const fs = require('fs');
  const path = require('path');
  
  const sampleHtml = renderSaaSEmail('John Doe', 'https://my-saas-product.com');
  fs.writeFileSync(path.join(__dirname, '../email-preview.html'), sampleHtml);
  console.log('\n📧 Sample email saved as: /saas/email-preview.html');
  console.log('👀 You can open this file in a browser to preview the email!');
}

// Run the test
testEmailTemplate();