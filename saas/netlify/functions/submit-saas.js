const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const { renderSaaSEmail, getSaaSEmailText } = require('./email-template');

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
    adSpend,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    landing_path
  } = data;

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

  // Insert into Supabase saas_leads table
  const { error } = await supabase
    .from('saas_leads')
    .insert([
      {
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        website: website ? website.trim() : null,
        ad_spend: adSpend || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        landing_path: landing_path || null,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) {
    console.error('Supabase insert error:', error);

    // Handle duplicate email error
    if (error.code === '23505') {
      // If email already exists, still try to send the email
      if (resend) {
        try {
          await sendB2BBlueprint(resend, email, firstName, website);
        } catch (emailError) {
          console.error('Email send error for existing user:', emailError);
        }
      }

      return {
        statusCode: 200, // Return success even for duplicates
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          message: 'Thank you! Check your email for the B2B lead generation blueprint.'
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

  // Send B2B Blueprint email
  if (resend) {
    try {
      await sendB2BBlueprint(resend, email, firstName, website);
      console.log('B2B Blueprint email sent to:', email);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails - lead is already saved
    }
  } else {
    console.log('Resend API key not configured - skipping email');
  }

  // Log success for debugging
  console.log('SaaS lead successfully saved:', email, 'Website:', website, 'Ad Spend:', adSpend);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: true,
      message: 'Thank you! Check your email for the B2B lead generation blueprint.'
    })
  };
};

// Helper function to send B2B Blueprint email
async function sendB2BBlueprint(resend, email, firstName, website) {
  const { data, error } = await resend.emails.send({
    from: 'Mike Nikolaou <mnikolaou@theobsidianco.com>',
    to: [email],
    subject: 'Your free SaaS funnel map + ad scripts (PDF inside)',
    html: renderSaaSEmail(firstName, website),
    text: getSaaSEmailText(firstName, website)
  });

  if (error) {
    throw error;
  }

  return data;
}