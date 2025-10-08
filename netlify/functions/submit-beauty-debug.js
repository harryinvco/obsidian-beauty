const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

exports.handler = async function(event, context) {
  console.log('🚀 BEAUTY DEBUG: Function called');
  console.log('Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Body:', event.body);
  
  // CORS headers for all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight');
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Check environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    console.log('🔍 Environment Variables Check:');
    console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('RESEND_API_KEY:', RESEND_API_KEY ? '✅ Set' : '❌ Missing');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error - Environment variables missing',
          details: {
            SUPABASE_URL: SUPABASE_URL ? 'Set' : 'Missing',
            SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
          }
        })
      };
    }

    // Initialize Supabase client
    console.log('🔌 Initializing Supabase client...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    console.log('📋 Parsing request body...');
    let data;
    try {
      data = JSON.parse(event.body);
      console.log('📨 Parsed data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('❌ JSON parse error:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    // Extract form fields
    const {
      email,
      firstName,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      landing_path
    } = data;

    console.log('📝 Form fields:', {
      email: email || 'Missing',
      firstName: firstName || 'Missing',
      utm_source: utm_source || 'None',
      utm_medium: utm_medium || 'None',
      utm_campaign: utm_campaign || 'None'
    });

    // Validate required fields
    if (!email || !firstName) {
      console.error('❌ Missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Email and firstName are required',
          received: { email: !!email, firstName: !!firstName }
        })
      };
    }

    // Prepare insert data
    const insertData = {
      email: email.toLowerCase().trim(),
      first_name: firstName.trim(),
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_term: utm_term || null,
      utm_content: utm_content || null,
      landing_path: landing_path || '/beauty/',
      created_at: new Date().toISOString()
    };

    console.log('💾 Attempting to insert into beauty_leads table...');
    console.log('Insert data:', JSON.stringify(insertData, null, 2));

    // Insert into Supabase beauty_leads table
    const { data: insertResult, error } = await supabase
      .from('beauty_leads')
      .insert([insertData])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', JSON.stringify(error, null, 2));
      
      // Check if table doesn't exist
      if (error.code === '42P01') {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Database table "beauty_leads" does not exist',
            solution: 'Run the create_beauty_leads_table.sql script in Supabase'
          })
        };
      }

      // Handle duplicate email error
      if (error.code === '23505') {
        console.log('⚠️ Duplicate email, but continuing...');
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
          details: error.message,
          code: error.code
        })
      };
    }

    console.log('✅ Insert successful:', insertResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Beauty lead saved successfully!',
        data: insertResult
      })
    };

  } catch (err) {
    console.error('💥 Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error', 
        details: err.message,
        stack: err.stack
      })
    };
  }
};