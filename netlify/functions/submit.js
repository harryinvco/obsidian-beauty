const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
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
      },
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  // Extract all form fields
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

  // Validate required fields
  if (!email || !firstName) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Email and first name are required' })
    };
  }

  // Insert into Supabase beauty_leads table
  const { error } = await supabase
    .from('beauty_leads')
    .insert([
      {
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
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

    // Handle duplicate email error - still send email if they already registered
    if (error.code === '23505') {
      // If email already exists, still try to send the email
      if (resend) {
        try {
          await sendWelcomeEmail(resend, email, firstName);
        } catch (emailError) {
          console.error('Email send error for existing user:', emailError);
        }
      }

      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'This email is already registered. Please check your inbox for the frameworks.'
        })
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to save your information. Please try again.' })
    };
  }

  // Send welcome email with frameworks
  if (resend) {
    try {
      await sendWelcomeEmail(resend, email, firstName);
      console.log('Welcome email sent to:', email);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails - lead is already saved
    }
  } else {
    console.log('Resend API key not configured - skipping email');
  }

  // Log success for debugging
  console.log('Lead successfully saved:', email);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: true,
      message: 'Thank you! Check your email for the frameworks.'
    })
  };
};

// Helper function to send welcome email
async function sendWelcomeEmail(resend, email, firstName) {
  const { data, error } = await resend.emails.send({
    from: 'Mike Nikolaou <mnikolaou@theobsidianco.com>',
    to: [email],
    subject: 'Your 7 beauty ad frameworks are ready ($47M generated)',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Beauty Ad Frameworks</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
          }
          .wrapper {
            background-color: #f5f5f5;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          }
          .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #fbbf24;
          }
          .header h1 {
            color: white;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 1px;
            margin: 0;
          }
          .content {
            padding: 40px 35px;
          }
          .greeting {
            font-size: 18px;
            color: #1a1a1a;
            margin-bottom: 20px;
          }
          .intro {
            font-size: 16px;
            line-height: 1.7;
            color: #4a4a4a;
            margin-bottom: 30px;
          }
          .cta-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            border: 2px solid #fbbf24;
          }
          .cta-title {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 15px;
          }
          .cta-button {
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white !important;
            text-decoration: none !important;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          .included-list {
            background: #f8f8f8;
            border-left: 4px solid #22c55e;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .included-list h3 {
            color: #1a1a1a;
            font-size: 16px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .included-list ul {
            list-style: none;
            padding: 0;
          }
          .included-list li {
            padding: 8px 0;
            color: #4a4a4a;
            font-size: 15px;
          }
          .included-list li:before {
            content: "✓ ";
            color: #22c55e;
            font-weight: bold;
            margin-right: 8px;
          }
          .divider {
            height: 1px;
            background: #e5e5e5;
            margin: 35px 0;
          }
          .offer-section {
            background: #fff8f0;
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
          }
          .offer-title {
            color: #1a1a1a;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 5px;
          }
          .offer-subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .offer-features {
            list-style: none;
            padding: 0;
            margin: 15px 0;
          }
          .offer-features li {
            padding: 8px 0;
            color: #4a4a4a;
            font-size: 15px;
          }
          .offer-features li:before {
            content: "→ ";
            color: #f59e0b;
            font-weight: bold;
            margin-right: 8px;
          }
          .price-tag {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            display: inline-block;
            font-weight: 700;
            font-size: 18px;
            margin: 15px 0;
          }
          .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 14px;
            margin-left: 10px;
          }
          .urgency {
            background: #fee2e2;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            font-size: 14px;
          }
          .signature {
            margin-top: 40px;
            padding-top: 20px;
          }
          .signature p {
            color: #4a4a4a;
            font-size: 15px;
            line-height: 1.6;
          }
          .signature-name {
            font-weight: 700;
            color: #1a1a1a;
            font-size: 16px;
            margin-top: 15px;
          }
          .signature-title {
            color: #666;
            font-size: 14px;
          }
          .footer {
            background: #fafafa;
            padding: 25px 35px;
            border-top: 1px solid #e5e5e5;
          }
          .ps {
            color: #666;
            font-size: 14px;
            font-style: italic;
            line-height: 1.5;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 25px 20px;
            }
            .header {
              padding: 30px 20px;
            }
            .cta-button {
              padding: 16px 30px;
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>YOUR BEAUTY AD FRAMEWORKS ARE READY</h1>
            </div>

            <div class="content">
              <p class="greeting">Hi ${firstName},</p>

              <p class="intro">Your 7 beauty ad frameworks are ready:</p>

              <div class="cta-section">
                <div class="cta-title">🎁 Download Everything Here</div>
                <a href="https://drive.google.com/drive/folders/14mcLU0_x0NRW_LIX61AvyZV_bsvZJzZM?usp=sharing" class="cta-button">
                  Access Your Frameworks →
                </a>
              </div>

              <div class="included-list">
                <h3>Inside Your Download:</h3>
                <ul>
                  <li>7 PDF frameworks with step-by-step instructions</li>
                  <li>Instagram safe zones guide (never get cut off again)</li>
                  <li>Beauty brand crisis swipe file (handle PR disasters)</li>
                  <li>30-day content calendar template</li>
                  <li>Copy-paste ad templates</li>
                  <li>7 real ad examples that generated 10x+ ROAS</li>
                </ul>
              </div>

              <p style="font-size: 16px; color: #4a4a4a; margin: 20px 0;">
                These frameworks generated <strong style="color: #22c55e;">$47M for beauty brands</strong>.
              </p>

              <p style="font-size: 16px; color: #4a4a4a; margin: 20px 0;">
                But here's the truth...
              </p>

              <p style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 20px 0;">
                Templates work. Custom campaigns work better.
              </p>

              <div class="divider"></div>

              <div class="offer-section">
                <div class="offer-title">Get Frameworks Customized for YOUR Brand</div>
                <div class="offer-subtitle">Limited-time offer for new subscribers</div>

                <ul class="offer-features">
                  <li>60-minute strategy call with me personally</li>
                  <li>3 custom campaigns designed for your brand</li>
                  <li>Complete with copy, creatives, and targeting</li>
                  <li>Delivered in 7 days</li>
                </ul>

                <div style="text-align: center;">
                  <span class="price-tag">$197 this week only</span>
                  <span class="original-price">Regular $997</span>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://calendly.com/mnikolaou-toc/creative-strategy-session" class="cta-button" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                    Book Your Custom Campaign Call →
                  </a>
                </div>

                <div class="urgency">
                  ⏰ Only 3 spots left this week
                </div>
              </div>

              <div class="signature">
                <p>Best,</p>
                <p class="signature-name">Mike Nikolaou</p>
                <p class="signature-title">COO, The Obsidian Co.</p>
              </div>
            </div>

            <div class="footer">
              <p class="ps">
                <strong>P.S.</strong> Check your inbox tomorrow for: "The $47K mistake everyone makes with beauty ads (and how to avoid it)"
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${firstName},

Your 7 beauty ad frameworks are ready:

Download Everything Here:
https://drive.google.com/drive/folders/14mcLU0_x0NRW_LIX61AvyZV_bsvZJzZM?usp=sharing

Inside:
✓ 7 PDF frameworks with step-by-step instructions
✓ Instagram safe zones guide (never get cut off again)
✓ Beauty brand crisis swipe file (handle PR disasters)
✓ 30-day content calendar template
✓ Copy-paste ad templates
✓ 7 real ad examples that generated 10x+ ROAS

These generated $47M for beauty brands.

But here's the truth...

Templates work. Custom campaigns work better.

Get frameworks customized for YOUR brand:
→ 60-minute strategy call with me personally
→ 3 custom campaigns designed for your brand
→ Complete with copy, creatives, and targeting
→ Delivered in 7 days

$197 this week only (regular $997)

Book Your Custom Campaign Call:
https://calendly.com/mnikolaou-toc/creative-strategy-session

Only 3 spots left this week.

Best,
Mike Nikolaou
COO, The Obsidian Co.

P.S. Check your inbox tomorrow for: "The $47K mistake everyone makes with beauty ads (and how to avoid it)"
    `
  });

  if (error) {
    throw error;
  }

  return data;
}