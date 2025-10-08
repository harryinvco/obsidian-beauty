const { createClient } = require('@supabase/supabase-js');

// Simple test function - just tests if environment vars work
exports.handler = async function(event, context) {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Environment check:', {
      SUPABASE_URL: SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
      SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? 'Set ✅' : 'Missing ❌'
    });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Environment variables not configured',
          details: {
            SUPABASE_URL: SUPABASE_URL ? 'Set' : 'Missing',
            SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
          }
        })
      };
    }

    // Test Supabase connection
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse form data
    const data = JSON.parse(event.body);
    const { email, firstName } = data;

    if (!email || !firstName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and firstName required' })
      };
    }

    console.log('Attempting to insert:', { email, firstName });

    // Try to insert into database
    const { data: insertData, error } = await supabase
      .from('ecom_leads')
      .insert([{
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        website: data.website || null,
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
        landing_path: data.landing_path || '/ecom-checklist/',
        ip_address: event.headers['x-forwarded-for'] || 'unknown',
        user_agent: event.headers['user-agent'] || 'unknown'
      }]);

    if (error) {
      console.error('Database insert error:', error);
      
      // Handle duplicate email
      if (error.code === '23505') {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ error: 'Email already registered' })
        };
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database insert failed', 
          details: error.message 
        })
      };
    }

    console.log('Insert successful:', insertData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Lead saved successfully!' 
      })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error', 
        details: err.message 
      })
    };
  }
};