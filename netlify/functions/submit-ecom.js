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
      const fs = require('fs');
      const path = require('path');
      
      // Read the HTML email template
      let emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your eCom Growth Leak Checklist is Ready!</title>
    <style>
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
            color: #334155;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #3380AB 0%, #6CAA33 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .main-text {
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 30px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3380AB 0%, #6CAA33 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(51, 128, 171, 0.3);
        }
        
        .pro-tip {
            background: linear-gradient(135deg, rgba(108, 170, 51, 0.08) 0%, rgba(51, 128, 171, 0.08) 100%);
            border-left: 4px solid #6CAA33;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        
        .pro-tip-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .options-section {
            background: #f8fafc;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .options-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
        }
        
        .option {
            margin-bottom: 15px;
            padding-left: 20px;
            position: relative;
        }
        
        .option::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #6CAA33;
            font-weight: bold;
        }
        
        .secondary-cta {
            display: inline-block;
            background: transparent;
            color: #3380AB;
            text-decoration: none;
            padding: 12px 24px;
            border: 2px solid #3380AB;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        
        .signature-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 16px;
        }
        
        .signature-title {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .signature-contact {
            font-size: 14px;
            color: #64748b;
        }
        
        .signature-contact a {
            color: #3380AB;
            text-decoration: none;
        }
        
        .footer {
            background: #f1f5f9;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
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
            
            .cta-button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎯 Your Checklist is Ready!</h1>
            <p>The exact 23-point audit that's helped 56+ stores find €12K+ in revenue leaks</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hey {{firstName}},</div>
            
            <div class="main-text">
                Thanks for grabbing the <strong>eCom Growth Leak Checklist</strong> — here's your instant access:
            </div>
            
            <div style="text-align: center;">
                <a href="https://obsidianco.notion.site/The-Obsidian-eCom-Growth-Leak-Checklist-284035fa86b480e5b7a3c871bae7d249?source=copy_link" class="cta-button">
                    🚀 Access Your Checklist Now
                </a>
            </div>
            
            <div class="main-text">
                This is the exact 23-point audit we use with our clients to fix revenue leaks in their paid ads, landing pages, and retention flows.
            </div>
            
            <div class="pro-tip">
                <div class="pro-tip-title">🧠 Pro Tip:</div>
                Most stores are bleeding money in 2–3 key areas — usually in the first 10 questions. Run through the checklist now (takes 10–15 mins) and score yourself honestly.
            </div>
            
            <div class="options-section">
                <div class="options-title">Once you've done that, you've got 2 solid options:</div>
                
                <div class="option">
                    <strong>Fix it yourself</strong> (the checklist shows you where to start)
                </div>
                
                <div class="option">
                    <strong>Save time →</strong> book a free 15-min Leak Fix Call and I'll walk you through exactly what to fix first.
                    <br>
                    <a href="https://calendly.com/mnikolaou-toc/lets-talk-15min" class="secondary-cta">
                        📞 Book Free Call
                    </a>
                </div>
            </div>
            
            <div class="main-text">
                <strong>No pitch. Just clarity.</strong>
            </div>
            
            <div class="main-text">
                Let me know if you hit any snags — happy to help.
            </div>
            
            <div class="signature">
                <div class="signature-name">Talk soon,<br>—Mike</div>
                <div class="signature-title">COO, The Obsidian Co.™</div>
                <div class="signature-contact">
                    <a href="mailto:mnikolaou@theobsidianco.com">mnikolaou@theobsidianco.com</a><br>
                    <a href="https://www.theobsidianco.com">www.theobsidianco.com</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 The Obsidian Co. All rights reserved.</p>
            <p style="margin-top: 5px;">You received this email because you downloaded our eCom Growth Leak Checklist.</p>
        </div>
    </div>
</body>
</html>`;
      
      // Replace placeholder with actual first name
      const personalizedEmail = emailTemplate.replace('{{firstName}}', firstName.trim() || 'there');
      
      await resend.emails.send({
        from: 'Mike from The Obsidian Co <mike@theobsidianco.com>',
        to: [email.toLowerCase().trim()],
        subject: '🎯 Your eCom Growth Leak Checklist is Ready!',
        html: personalizedEmail,
        text: `Hey ${firstName.trim() || 'there'},

Thanks for grabbing the eCom Growth Leak Checklist — here is the link: https://obsidianco.notion.site/The-Obsidian-eCom-Growth-Leak-Checklist-284035fa86b480e5b7a3c871bae7d249?source=copy_link

This is the exact 23-point audit we use with our clients to fix revenue leaks in their paid ads, landing pages, and retention flows.

🧠 Pro Tip: Most stores are bleeding money in 2–3 key areas — usually in the first 10 questions. Run through the checklist now (takes 10–15 mins) and score yourself honestly.

Once you've done that, you've got 2 solid options:

→ Fix it yourself (the checklist shows you where to start)
→ Or if you'd rather save time → book a free 15-min Leak Fix Call (https://calendly.com/mnikolaou-toc/lets-talk-15min) and I'll walk you through exactly what to fix first.

No pitch. Just clarity.

Let me know if you hit any snags — happy to help.

Talk soon,
—Mike
COO, The Obsidian Co.™
mnikolaou@theobsidianco.com
www.theobsidianco.com`
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
  };
};