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
    subject: `${firstName}, your $50/day B2B lead system is ready (206 demos blueprint)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your B2B Lead Generation Blueprint</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
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
            background: linear-gradient(135deg, #6B46C1 0%, #553C9A 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }
          .content {
            padding: 40px 35px;
          }
          .cta-button {
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white !important;
            text-decoration: none !important;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25);
          }
          .results-box {
            background: #F0FDF4;
            border-left: 4px solid #22C55E;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .urgency {
            background: #FEF2F2;
            color: #DC2626;
            padding: 15px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>🚀 Your B2B Lead System Is Ready!</h1>
            </div>

            <div class="content">
              <p>Hi ${firstName},</p>

              <p><strong>Congrats!</strong> You're about to get the exact system that generated 206 qualified demos in just 31 days with only $50/day ad spend.</p>

              ${website ? `<p>I noticed you're working on <strong>${website}</strong> - this system will be perfect for scaling your lead generation.</p>` : ''}

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://drive.google.com/file/d/1xK8Jp4LkQZ3NYoKZ9ZH6TzVB2mN9XyPR/view?usp=sharing" class="cta-button">
                  Download Your Blueprint Now →
                </a>
              </div>

              <div class="results-box">
                <h3 style="margin-top: 0;">What You're Getting:</h3>
                <ul style="padding-left: 20px;">
                  <li><strong>The $50/Day Framework:</strong> Exact ad strategy & targeting</li>
                  <li><strong>Landing Page Template:</strong> High-converting page structure</li>
                  <li><strong>Email Sequences:</strong> 7-email nurture campaign</li>
                  <li><strong>Demo Booking Scripts:</strong> Convert leads to calls</li>
                  <li><strong>Case Study:</strong> How CS Bridge booked 206 demos</li>
                  <li><strong>Scaling Playbook:</strong> Go from $50 to $5000/day</li>
                </ul>
              </div>

              <p><strong>Quick Start Guide:</strong></p>
              <ol style="padding-left: 20px; line-height: 1.8;">
                <li>Download the blueprint (link above)</li>
                <li>Start with Section 2: "The $50/Day Setup"</li>
                <li>Copy our exact targeting parameters</li>
                <li>Launch your first campaign today</li>
              </ol>

              <div class="urgency">
                ⚡ Bonus: Reply to this email with your biggest lead gen challenge, and I'll send you a personalized tip
              </div>

              <p>To your success,</p>
              <p><strong>Mike Nikolaou</strong><br>
              COO, The Obsidian Co.<br>
              <em>P.S. Tomorrow, I'll send you our "First 48 Hours Checklist" - the exact steps to get your first demo booked this week.</em></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${firstName},

Congrats! You're about to get the exact system that generated 206 qualified demos in just 31 days with only $50/day ad spend.

${website ? `I noticed you're working on ${website} - this system will be perfect for scaling your lead generation.\n` : ''}

Download Your Blueprint Now:
https://drive.google.com/file/d/1xK8Jp4LkQZ3NYoKZ9ZH6TzVB2mN9XyPR/view?usp=sharing

What You're Getting:
• The $50/Day Framework: Exact ad strategy & targeting
• Landing Page Template: High-converting page structure
• Email Sequences: 7-email nurture campaign
• Demo Booking Scripts: Convert leads to calls
• Case Study: How CS Bridge booked 206 demos
• Scaling Playbook: Go from $50 to $5000/day

Quick Start Guide:
1. Download the blueprint (link above)
2. Start with Section 2: "The $50/Day Setup"
3. Copy our exact targeting parameters
4. Launch your first campaign today

⚡ Bonus: Reply to this email with your biggest lead gen challenge, and I'll send you a personalized tip

To your success,
Mike Nikolaou
COO, The Obsidian Co.

P.S. Tomorrow, I'll send you our "First 48 Hours Checklist" - the exact steps to get your first demo booked this week.`
  });

  if (error) {
    throw error;
  }

  return data;
}