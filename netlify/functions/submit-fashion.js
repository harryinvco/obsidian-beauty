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
        subject: `Here's your download — A Ready-to-Implement Fashion Campaign That Increased ROAS by 74%`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Reset */
              * { margin: 0; padding: 0; box-sizing: border-box; }
              
              /* Light mode - default colors */
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
                color: #1e293b;
              }
              
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              
            .header {
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              padding: 40px 30px;
              text-align: center;
            }
            
            .header h1 {
              color: #fbbf24;
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 10px 0;
              line-height: 1.3;
              text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
              opacity: 1;
              letter-spacing: -0.5px;
            }
            
            .header p {
              color: #fcd34d;
              font-size: 16px;
              margin: 0;
              text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
              opacity: 1;
              font-weight: 500;
            }              .content {
                padding: 40px 30px;
                background-color: #ffffff;
                color: #1e293b;
              }
              
              .content p {
                color: #374151;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 20px 0;
              }
              
              .content strong {
                color: #1e293b;
                font-weight: 600;
              }
              
              .download-cta-box {
                background: linear-gradient(135deg, #28a745 0%, #20883a 100%);
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
              }
              
            .download-cta-box p {
              color: #fbbf24;
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 20px 0;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }              .download-cta-box a {
                display: inline-block;
                background: #ffffff;
                color: #28a745;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 700;
                font-size: 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
              }
              
              .download-cta-box a:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
              }
              
              .features-box {
                background: #f8f9fa;
                border-left: 4px solid #28a745;
                padding: 25px;
                margin: 30px 0;
                border-radius: 8px;
              }
              
              .features-box p {
                color: #1a1a1a;
                font-size: 15px;
                font-weight: 600;
                margin: 0 0 15px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              .features-box ul {
                color: #333333;
                font-size: 16px;
                line-height: 1.8;
                margin: 0;
                padding-left: 20px;
              }
              
              .features-box li {
                margin-bottom: 10px;
              }
              
              .secondary-cta {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 35px 0 0 0;
                text-align: center;
              }
              
              .secondary-cta p {
                color: #333333;
                font-size: 15px;
                margin: 0 0 15px 0;
              }
              
              .secondary-cta a {
                display: inline-block;
                background: #1a1a1a;
                color: #fbbf24;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 15px;
                transition: all 0.3s ease;
              }
              
              .secondary-cta a:hover {
                background: #2d2d2d;
                color: #fcd34d;
              }
              
              .signature {
                margin: 20px 0;
                color: #1a1a1a;
              }
              
              .signature p {
                margin: 0 0 5px 0;
                font-weight: 600;
                font-size: 16px;
              }
              
              .signature-title {
                color: #666666;
                font-size: 15px;
                margin: 5px 0 0 0;
                font-style: italic;
              }
              
              .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
              }
              
              .footer p {
                color: #666666;
                font-size: 13px;
                margin: 0 0 8px 0;
                line-height: 1.5;
              }
              
              .footer strong {
                color: #1a1a1a;
              }
              
              /* Dark mode support */
              @media (prefers-color-scheme: dark) {
                body {
                  background-color: #1e293b;
                  color: #f1f5f9;
                }
                
                .email-container {
                  background-color: #1f2937;
                }
                
                .content {
                  background-color: #1f2937;
                  color: #e5e7eb;
                }
                
                .content p {
                  color: #d1d5db;
                }
                
                .content strong {
                  color: #f1f5f9;
                }
                
                .features-box {
                  background: #111827;
                  border-left-color: #28a745;
                }
                
                .features-box p {
                  color: #f1f5f9;
                }
                
                .features-box ul {
                  color: #e5e7eb;
                }
                
                .secondary-cta {
                  background: #111827;
                }
                
                .secondary-cta p {
                  color: #e5e7eb;
                }
                
                .signature {
                  color: #e5e7eb;
                }
                
                .signature p {
                  color: #f1f5f9;
                }
                
                .signature-title {
                  color: #9ca3af;
                }
                
                .footer {
                  background: #111827;
                  border-top-color: #374151;
                }
                
                .footer p {
                  color: #9ca3af;
                }
                
                .footer strong {
                  color: #e5e7eb;
                }
              }
              
              @media (max-width: 600px) {
                .email-container {
                  margin: 0;
                  border-radius: 0;
                }
                
                .header, .content {
                  padding: 30px 20px;
                }
                
                .header h1 {
                  font-size: 24px;
                }
                
                .download-cta-box a {
                  display: block;
                  text-align: center;
                  width: 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Your Fashion Campaign Framework</h1>
                <p>A Ready-to-Implement System That Increased ROAS by 74% in 90 Days</p>
              </div>

              <div class="content">
                <p>Hey!</p>

                <p>
                  Here's the download you requested — <strong>A Ready-to-Implement Fashion Campaign That Can Increase Your ROAS by 74% in 90 Days with Near-zero Production Costs</strong>.
                </p>

              <!-- Download CTA Box -->
              <div class="download-cta-box">
                <p>📥 Download Your Campaign Framework</p>
                <a href="https://drive.google.com/drive/folders/1fwImxLIDpMFVFhUwtAh5q4ycLAmUI6hK?usp=drive_link" style="display: inline-block; text-decoration: none;">
                  Get Instant Access →
                </a>
              </div>                <!-- What's Inside -->
                <div class="features-box">
                  <p>Inside, you'll find:</p>
                  <ul>
                    <li>How a footwear brand scaled <strong>74% ROAS</strong> without increasing spend</li>
                    <li>How <strong>Kipling achieved 16.9× ROAS</strong> with a creative rotation system</li>
                    <li>Why most fashion campaigns plateau after Month 2 — <strong>and how to fix it</strong></li>
                  </ul>
                </div>

                <p>
                  No sales pitch. No follow-up ask. Just the same campaign framework we use internally to scale fashion brands profitably with minimal production costs.
                </p>

                <p style="font-weight: 600;">
                  Read it. Apply it. Watch how a proven system outperforms expensive creative every time.
                </p>

                <div class="signature">
                  <p>Talk soon,</p>
                  <p>— Mike, COO</p>
                  <p class="signature-title">The Obsidian Co.</p>
                </div>

                <!-- Optional CTA -->
                <div class="secondary-cta">
                  <p>
                    <strong>Want us to apply this campaign to your account?</strong>
                  </p>
                  <a href="https://calendly.com/mnikolaou-toc/digital-marketing-branding-fashion-industry" style="text-decoration: none;">
                    📅 Book a Free Scale Session
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>
                  <strong>The Obsidian Co</strong> | Performance Marketing Agency
                </p>
                <p>
                  You're receiving this because you downloaded our Fashion Campaign Framework.
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
      message: 'Thank you! Check your email for the campaign framework.'
    })
  }
};