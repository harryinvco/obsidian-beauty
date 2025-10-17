const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

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
      body: JSON.stringify({ error: 'Failed to save your information. Please try again.' })
    };
  }

  console.log('Fashion lead saved successfully:', email);

  // Send welcome email with fashion frameworks
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Mike at The Obsidian Co <hello@theobsidianco.com>',
        to: [email],
        subject: `Here's your download — 3 Fashion Ad Frameworks That Increased ROAS by 74%`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.3;">Your Fashion Ad Frameworks</h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">3 Systems That Increased ROAS by 74% in 90 Days</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hey!</p>

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                  Here's the download you requested — <strong>3 Fashion & Footwear Ad Frameworks That Increased ROAS by 74% in 90 Days</strong>.
                </p>

                <!-- Download CTA Box -->
                <div style="background: linear-gradient(135deg, #28a745 0%, #20883a 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                  <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">📥 Download Your Frameworks</p>
                  <a href="https://theobsidianco.com/fashion-frameworks" style="display: inline-block; background: #ffffff; color: #28a745; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    Get Instant Access →
                  </a>
                </div>

                <!-- What's Inside -->
                <div style="background: #f8f9fa; border-left: 4px solid #28a745; padding: 25px; margin: 30px 0; border-radius: 8px;">
                  <p style="color: #1a1a1a; font-size: 15px; font-weight: 600; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">Inside, you'll find:</p>
                  <ul style="color: #333333; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">How a footwear brand scaled <strong>74% ROAS</strong> without increasing spend</li>
                    <li style="margin-bottom: 10px;">How <strong>Kipling achieved 16.9× ROAS</strong> with a creative rotation system</li>
                    <li style="margin-bottom: 0;">Why most fashion campaigns plateau after Month 2 — <strong>and how to fix it</strong></li>
                  </ul>
                </div>

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                  No sales pitch. No follow-up ask. Just the same structures we use internally to scale eCommerce brands profitably.
                </p>

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 25px 0; font-weight: 600;">
                  Read it. Apply it. Watch how structure outperforms "new creative" every time.
                </p>

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 10px 0;">
                  Talk soon,
                </p>

                <div style="margin: 20px 0;">
                  <p style="color: #1a1a1a; font-size: 16px; margin: 0; font-weight: 600;">— Mike, COO</p>
                  <p style="color: #666666; font-size: 15px; margin: 5px 0 0 0; font-style: italic;">The Obsidian Co.</p>
                </div>

                <!-- Optional CTA -->
                <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 35px 0 0 0; text-align: center;">
                  <p style="color: #333333; font-size: 15px; margin: 0 0 15px 0;">
                    <strong>Want us to apply these frameworks to your account?</strong>
                  </p>
                  <a href="https://theobsidianco.com/contact" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                    📅 Book a Free Scale Session
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #666666; font-size: 13px; margin: 0 0 8px 0; line-height: 1.5;">
                  <strong>The Obsidian Co</strong> | Performance Marketing Agency
                </p>
                <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.5;">
                  You're receiving this because you downloaded our Fashion Scaling Frameworks.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
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
      message: 'Thank you! Check your email for the frameworks.'
    })
  }
};