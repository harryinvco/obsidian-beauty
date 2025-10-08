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

  // TEMPORARILY DISABLED - Return success without saving to database
  console.log('Fashion form submission (temporarily disabled):', {
    email: email.toLowerCase().trim(),
    firstName: firstName.trim(),
    website: website.trim(),
    adSpend,
    monthlyRevenue,
    growthChallenge,
    utm_source,
    utm_medium,
    utm_campaign,
    landing_path
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: true,
      message: 'Thank you for your interest! This page is currently under development.'
    })
  };

  // TODO: Uncomment when ready to go live
  /*
  // Insert into Supabase fashion_leads table
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
        landing_path: landing_path || null,
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

  // Send welcome email with fashion frameworks
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Fashion Frameworks <hello@theobsidianco.com>',
        to: [email],
        subject: `${firstName}, Your Fashion & Footwear Scaling Frameworks Are Ready 🎁`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #020202; margin-bottom: 20px;">Your Fashion Scaling Frameworks Are Here! 🎁</h1>
            
            <p>Hi ${firstName},</p>
            
            <p>Thank you for downloading our Fashion & Footwear Scaling Frameworks! You now have access to the same systems that helped:</p>
            
            <ul>
              <li><strong>Kipling achieve 16.9× ROAS</strong> in 3 months</li>
              <li><strong>A top footwear brand increase ROAS by 74%</strong> in 90 days</li>
              <li><strong>Scale $27M in fashion revenue</strong> across our client portfolio</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #020202; margin-top: 0;">📥 Your Download Includes:</h3>
              <ul>
                <li>🧩 <strong>The Story-Based Framework</strong> - Brand storytelling to ROAS</li>
                <li>🪞 <strong>The Style-Proof System</strong> - Creative angle rotation strategy</li>
                <li>📈 <strong>The Social Anchor</strong> - Influencer-level performance without the cost</li>
              </ul>
            </div>
            
            <p><strong>Download Link:</strong> <a href="https://theobsidianco.com/fashion-frameworks" style="color: #3380AB; text-decoration: none;">Get Your Frameworks Here →</a></p>
            
            <hr style="border: 1px solid #e9ecef; margin: 30px 0;">
            
            <h3 style="color: #020202;">💡 Want Us to Apply These to Your Store?</h3>
            <p>Based on your info (${monthlyRevenue} monthly revenue, ${adSpend} ad spend), we think the <strong>${growthChallenge}</strong> challenge you mentioned could be solved with our frameworks.</p>
            
            <p><a href="https://theobsidianco.com/contact" style="background: #6CAA33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">📅 Book a Free Strategy Session</a></p>
            
            <p>Questions? Reply to this email - we read every response.</p>
            
            <p>Talk soon,<br>
            <strong>The Obsidian Co Team</strong><br>
            <em>Performance frameworks for fashion & eCommerce brands</em></p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d;">
              <p>The Obsidian Co | Performance Marketing Agency</p>
              <p>You're receiving this because you downloaded our Fashion Scaling Frameworks from ${website || 'our website'}.</p>
            </div>
          </div>
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
  };
  */
};