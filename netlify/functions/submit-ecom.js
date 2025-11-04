const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const { renderEcomEmail, getEcomEmailText } = require('./ecom-email-template');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Check for environment variables
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Initialize Resend client if API key is provided
  const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

  // Parse request body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  // Extract all form fields
  const {
    email,
    firstName,
    website,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    landing_path
  } = data;

  // Get client IP and user agent for tracking - handle multiple IPs safely
  const rawIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
  // If multiple IPs, take the first one (client IP)
  const clientIP = rawIP.includes(',') ? rawIP.split(',')[0].trim() : rawIP;
  const userAgent = event.headers['user-agent'] || 'unknown';

  // Validate required fields
  if (!email || !firstName) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Email and first name are required' })
    };
  }

  // Log form submission for debugging
  console.log('Ecom-checklist form submission:', {
    email: email.toLowerCase().trim(),
    firstName: firstName.trim(),
    utm_source,
    utm_medium,
    utm_campaign,
    landing_path
  });

  // Insert into Supabase ecom_leads table
  const { error } = await supabase
    .from('ecom_leads')
    .insert([
      {
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        website: website ? website.trim() : null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        landing_path: landing_path || '/ecom-checklist/',
        ip_address: clientIP,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) {
    console.error('Supabase insert error:', error);

    // Handle duplicate email error
    if (error.code === '23505') {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'This email is already registered. Please check your inbox.'
        })
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to save your information. Please try again.' })
    };
  }

  // Send welcome email with checklist
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Mike from The Obsidian Co <mike@theobsidianco.com>',
        to: [email.toLowerCase().trim()],
        subject: '🎯 Your eCom Growth Leak Checklist is Ready!',
        html: renderEcomEmail(firstName.trim()),
        text: getEcomEmailText(firstName.trim())
      });

      console.log('Welcome email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the whole request if email fails
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: true,
      message: 'Thank you! Check your email for the checklist.'
    })
  }
};
