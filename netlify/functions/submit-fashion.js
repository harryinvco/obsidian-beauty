const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const { renderFashionEmail, getFashionEmailText } = require('./fashion-email-template');

exports.handler = async function(event, context) {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

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
    console.log('Fashion form submission received:', {
      email: data.email?.toLowerCase().trim(),
      firstName: data.firstName,
      hasWebsite: !!data.website,
      hasAdSpend: !!data.adSpend,
      hasMonthlyRevenue: !!data.monthlyRevenue,
      hasGrowthChallenge: !!data.growthChallenge
    });
  } catch (e) {
    console.error('JSON parse error:', e.message);
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
    adSpend,
    monthlyRevenue,
    growthChallenge,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    landing_path
  } = data;

  // Validate required fields
  if (!email || !firstName || !website || !adSpend || !monthlyRevenue || !growthChallenge) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'All form fields are required' })
    };
  }

  // Validate work email (no Gmail, Yahoo, etc.)
  const personalEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
  const emailDomain = email.toLowerCase().split('@')[1];
  if (personalEmailDomains.includes(emailDomain)) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Please use your work email (no Gmail, Yahoo, etc.)' })
    };
  }

  // Insert into Supabase fashion_leads table
  console.log('Attempting to save fashion lead to Supabase...');

  const { error } = await supabase
    .from('fashion_leads')
    .insert([
      {
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        website: website.trim(),
        ad_spend: adSpend,
        monthly_revenue: monthlyRevenue,
        growth_challenge: growthChallenge,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        landing_path: landing_path || null
      }
    ]);

  if (error) {
    console.error('Supabase insert error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });

    // Handle duplicate email error
    if (error.code === '23505') {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'This email is already registered. Please check your inbox for the download link.'
        })
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to save your information. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }

  console.log('Fashion lead saved successfully:', email);

  // Send welcome email with fashion frameworks
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Mike at The Obsidian Co <hello@theobsidianco.com>',
        to: [email],
        subject: `Here's your download — A Ready-to-Implement Fashion Campaign That Increased ROAS by 74%`,
        html: renderFashionEmail(),
        text: getFashionEmailText()
      });

      console.log('Fashion welcome email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Continue anyway - don't fail the whole request for email issues
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
      message: 'Thank you! Check your email for the campaign framework.'
    })
  }
};
