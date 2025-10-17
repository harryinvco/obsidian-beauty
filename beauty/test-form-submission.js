// Test script for beauty form submission with new fields
const testData = {
  email: "test@example.com",
  firstName: "Test User", 
  storeLink: "https://instagram.com/testbeauty",
  biggestGrowthIssue: "Low ROAS/Poor ad performance",
  utm_source: "test",
  utm_medium: "test",
  utm_campaign: "test",
  utm_term: "",
  utm_content: "",
  landing_path: "/beauty/"
};

async function testSubmission() {
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Test passed! New fields are working.');
    } else {
      console.log('❌ Test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Only run if this file is executed directly
if (typeof window === 'undefined') {
  testSubmission();
}

console.log('Test data prepared for beauty form with new fields:');
console.log(JSON.stringify(testData, null, 2));