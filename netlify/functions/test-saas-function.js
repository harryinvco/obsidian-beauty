const { handler } = require('./submit-saas.js');

// Test data
const testEvent = {
  httpMethod: 'POST',
  body: JSON.stringify({
    email: 'test@example.com',
    firstName: 'Test User',
    utm_source: 'test',
    utm_medium: 'manual',
    utm_campaign: 'test_campaign',
    landing_path: '/saas'
  })
};

const testContext = {};

// Test the function
handler(testEvent, testContext)
  .then(result => {
    console.log('✅ Function test result:');
    console.log('Status:', result.statusCode);
    console.log('Body:', result.body);
  })
  .catch(error => {
    console.error('❌ Function test error:', error);
  });