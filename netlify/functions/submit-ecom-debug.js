const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

exports.handler = async function(event, context) {
  console.log('🚀 Function called with method:', event.httpMethod);
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
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

  console.log('🔍 Environment check:', {
    SUPABASE_URL: SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    RESEND_API_KEY: RESEND_API_KEY ? '✅ Set' : '❌ Missing'
  });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Server configuration error - missing environment variables',
        debug: {
          SUPABASE_URL: SUPABASE_URL ? 'set' : 'missing',
          SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing'
        }
      })
    };
  }

  // Parse request body
  let data;
  try {
    data = JSON.parse(event.body);
    console.log('📝 Parsed form data:', { 
      email: data.email ? '✅' : '❌', 
      firstName: data.firstName ? '✅' : '❌',
      website: data.website || 'not provided'
    });
  } catch (e) {
    console.error('❌ JSON parse error:', e.message);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  // Extract form fields
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

  // Get client info - handle multiple IPs safely
  const rawIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
  // If multiple IPs, take the first one (client IP)
  let clientIP = rawIP.includes(',') ? rawIP.split(',')[0].trim() : rawIP;
  
  // Validate IP format - if it's not a valid IP, store as text
  if (clientIP !== 'unknown' && !/^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/.test(clientIP)) {
    console.log('Invalid IP format, storing as unknown:', clientIP);
    clientIP = 'unknown';
  }
  
  const userAgent = event.headers['user-agent'] || 'unknown';

  // Validate required fields
  if (!email || !firstName) {
    console.log('❌ Validation failed:', { email: !!email, firstName: !!firstName });
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Email and first name are required' })
    };
  }

  console.log('✅ Validation passed');

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

  try {
    console.log('💾 Inserting into database...');
    
    // Insert into Supabase ecom_leads table
    const { data: insertData, error } = await supabase
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
      ])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);

      // Handle duplicate email error
      if (error.code === '23505') {
        return {
          statusCode: 409,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'This email is already registered. Please check your inbox for the checklist.'
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
          debug: error.message
        })
      };
    }

    console.log('✅ Database insert successful:', insertData[0]?.id);

    // Send welcome email
    if (resend) {
      try {
        console.log('📧 Sending welcome email...');
        
        // Simple email for now - we can enhance later
        await resend.emails.send({
          from: 'Mike from The Obsidian Co <mike@theobsidianco.com>',
          to: [email.toLowerCase().trim()],
          subject: '🎯 Your eCom Growth Leak Checklist is Ready!',
          text: `Hey ${firstName.trim() || 'there'},

Thanks for grabbing the eCom Growth Leak Checklist!

Here's your instant access: https://obsidianco.notion.site/The-Obsidian-eCom-Growth-Leak-Checklist-284035fa86b480e5b7a3c871bae7d249

This is the exact 23-point audit we use with our clients to fix revenue leaks.

🧠 Pro Tip: Most stores are bleeding money in 2–3 key areas. Run through the checklist now (takes 10–15 mins).

Want help? Book a free 15-min call: https://calendly.com/mnikolaou-toc/lets-talk-15min

Talk soon,
—Mike
COO, The Obsidian Co.™`
        });
        
        console.log('✅ Welcome email sent successfully');
        
      } catch (emailError) {
        console.error('❌ Email send error:', emailError);
        // Don't fail the whole request if email fails
      }
    } else {
      console.log('⚠️  No Resend API key - email not sent');
    }

    console.log('🎉 Success! Lead captured and email sent');
    
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
    };

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again.',
        debug: err.message
      })
    };
  }
};