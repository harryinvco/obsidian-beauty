const fs = require('fs');
const path = require('path');

// Function to get the HTML email template
function getSaaSEmailTemplate() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your free SaaS funnel map + ad scripts (PDF inside)</title>
  <!--[if mso]>
  <style type="text/css">
    table, td, div, p, a, h1, h2, h3, h4, h5, h6 {
      font-family: Arial, sans-serif !important;
    }
  </style>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }

    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #F2F2F2;
      font-family: 'Questrial', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #020202;
    }

    /* Container */
    .email-wrapper {
      width: 100% !important;
      background-color: #F2F2F2;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #F9F9F9;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(2, 2, 2, 0.15);
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #020202 0%, #3380AB 100%);
      padding: 30px 40px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 700;
      margin: 0;
      line-height: 1.3;
    }
    .header p {
      color: #E0E7FF;
      font-size: 16px;
      margin: 10px 0 0 0;
    }

    /* Content */
    .content {
      padding: 40px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.7;
      margin: 0 0 20px 0;
      color: #020202;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #020202;
      margin-bottom: 24px !important;
    }

    /* Resource Box */
    .resource-box {
      background: linear-gradient(135deg, rgba(108, 170, 51, 0.15) 0%, rgba(108, 170, 51, 0.08) 100%);
      border: 2px solid #6CAA33;
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
      text-align: center;
    }
    .resource-box h2 {
      color: #020202;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }
    .resource-box p {
      color: #020202;
      font-size: 16px;
      margin: 0 0 20px 0;
    }

    /* Feature List */
    .feature-list {
      background: rgba(51, 128, 171, 0.08);
      border-radius: 8px;
      padding: 24px;
      margin: 25px 0;
      border: 1px solid rgba(51, 128, 171, 0.2);
    }
    .feature-list h3 {
      color: #020202;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    .feature-list ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .feature-list li {
      color: #020202;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 12px 0;
      padding-left: 24px;
      position: relative;
    }
    .feature-list li:before {
      content: "✅";
      position: absolute;
      left: 0;
      top: 0;
    }

    /* CTA Button */
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 18px 36px;
      background: linear-gradient(135deg, #6CAA33 0%, #5a8f2b 100%);
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(108, 170, 51, 0.35);
    }

    /* CTA Section */
    .cta-section {
      background: rgba(51, 128, 171, 0.12);
      border: 2px solid #3380AB;
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
    }
    .cta-section h3 {
      color: #020202;
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 12px 0;
    }
    .cta-section p {
      color: #020202;
      font-size: 15px;
      margin: 0 0 16px 0;
    }
    .cta-section ul {
      margin: 16px 0;
      padding-left: 20px;
    }
    .cta-section li {
      color: #020202;
      font-size: 15px;
      margin: 8px 0;
    }

    /* Secondary CTA */
    .secondary-cta {
      background: rgba(108, 170, 51, 0.08);
      border: 2px solid #6CAA33;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    .secondary-button {
      display: inline-block;
      padding: 14px 28px;
      background: #3380AB;
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(51, 128, 171, 0.25);
    }

    /* Footer */
    .footer {
      background: #E4E4E4;
      padding: 30px 40px;
      text-align: left;
      border-top: 1px solid #020202;
    }
    .signature {
      font-size: 16px;
      color: #020202;
      margin: 20px 0 0 0;
    }
    .signature strong {
      color: #020202;
    }
    .company-info {
      font-size: 14px;
      color: #020202;
      margin: 8px 0 0 0;
    }
    .company-info a {
      color: #3380AB;
      text-decoration: none;
    }

    /* Mobile Responsive */
    @media only screen and (max-width: 480px) {
      .email-container {
        border-radius: 0 !important;
        margin: 0 !important;
      }
      .content, .header, .footer {
        padding: 24px 20px !important;
      }
      .header h1 {
        font-size: 22px !important;
      }
      .cta-button {
        padding: 16px 24px !important;
        font-size: 15px !important;
      }
    }

    /* Dark mode support - Maintain Obsidian Co branding */
    @media (prefers-color-scheme: dark) {
      .email-wrapper {
        background-color: #020202 !important;
      }
      .email-container {
        background: #2a6a8a !important;
        color: #F9F9F9 !important;
      }
      .content p, .greeting {
        color: #F9F9F9 !important;
      }
      .feature-list {
        background: rgba(108, 170, 51, 0.15) !important;
      }
      .feature-list h3 {
        color: #F9F9F9 !important;
      }
      .feature-list li {
        color: #F9F9F9 !important;
      }
      .footer {
        background: #020202 !important;
      }
      .signature, .signature strong, .company-info {
        color: #F9F9F9 !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <h1>🚀 Your SaaS Funnel Map Is Ready!</h1>
              <p>The exact system that booked 206 demos in 31 days</p>
              <p style="font-size: 12px; color: rgba(255, 255, 255, 0.8); margin-top: 15px; font-weight: 400;">
                <strong style="color: #6CAA33;">THE OBSIDIAN CO.™</strong>
              </p>
            </div>

            <!-- Main Content -->
            <div class="content">
              <p class="greeting">Hey {{firstName}},</p>
              
              <p>Just sent over your free resource:</p>

              <!-- Resource Box -->
              <div class="resource-box">
                <h2>✅ The $50/Day SaaS Demo Funnel Blueprint</h2>
                <p>The same system Chili used to book 206 demos in 31 days from cold traffic.</p>
              </div>

              <!-- Feature List -->
              <div class="feature-list">
                <h3>Inside you'll find:</h3>
                <ul>
                  <li><strong>The full ad-to-call funnel map</strong></li>
                  <li><strong>3 plug-and-play ad frameworks</strong> (copy included)</li>
                  <li><strong>A quiz funnel template</strong> that filters out junk leads</li>
                  <li><strong>Our demo-optimized landing page wireframe</strong></li>
                </ul>
              </div>

              <!-- Main CTA -->
              <div class="cta-container">
                <a href="https://obsidianco.notion.site/The-Obsidian-eCom-Growth-Leak-Checklist-284035fa86b480e5b7a3c871bae7d249?source=copy_link" class="cta-button">
                  👉 Download It Here
                </a>
              </div>

              <!-- CTA Section -->
              <div class="cta-section">
                <h3>🧠 Want help applying it to your SaaS?</h3>
                <p>If you'd rather not DIY it, we can walk you through it in a free 20-min SaaS Growth Session.</p>
                
                <p><strong>We'll show you:</strong></p>
                <ul>
                  <li>Where your current funnel is leaking</li>
                  <li>How to implement the system for your product</li>
                  <li>The fastest path to consistent demo bookings</li>
                </ul>
                
                <p><em>No pitch. No fluff. Just clarity.</em></p>
              </div>

              <!-- Secondary CTA Button -->
              <div class="secondary-cta">
                <a href="https://calendly.com/mnikolaou-toc/lets-talk-15min" class="secondary-button">
                  📅 Book Your Free Session Here
                </a>
              </div>

              <p>Talk soon,</p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="signature">
                <strong>—Mike</strong><br>
                COO, The Obsidian Co.™
              </div>
              <div class="company-info">
                <a href="mailto:mnikolaou@theobsidianco.com">mnikolaou@theobsidianco.com</a><br>
                <a href="https://www.theobsidianco.com">www.theobsidianco.com</a>
              </div>
            </div>

          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

// Function to render the email template with dynamic data
function renderSaaSEmail(firstName, website) {
  let html = getSaaSEmailTemplate();
  
  // Replace template variables
  html = html.replace(/{{firstName}}/g, firstName || 'there');
  
  // Update the download link to the new Notion URL
  html = html.replace(
    'https://drive.google.com/drive/folders/1SjYPBoBrZGsre26-e4_VWRBJA22mvCez?usp=sharing',
    'https://obsidianco.notion.site/The-Obsidian-eCom-Growth-Leak-Checklist-284035fa86b480e5b7a3c871bae7d249?source=copy_link'
  );
  
  return html;
}

// Function to get plain text version of the email
function getSaaSEmailText(firstName, website) {
  return `Hey ${firstName || 'there'},

Just sent over your free resource:

✅ The $50/Day SaaS Demo Funnel Blueprint — the same system Chili used to book 206 demos in 31 days from cold traffic.

Inside you'll find:

• The full ad-to-call funnel map
• 3 plug-and-play ad frameworks (copy included)  
• A quiz funnel template that filters out junk leads
• Our demo-optimized landing page wireframe

👉 Download it here: https://obsidianco.notion.site/The-Obsidian-eCom-Growth-Leak-Checklist-284035fa86b480e5b7a3c871bae7d249?source=copy_link

🧠 Want help applying it to your SaaS?
If you'd rather not DIY it, we can walk you through it in a free 20-min SaaS Growth Session.

We'll show you:
• Where your current funnel is leaking
• How to implement the system for your product  
• The fastest path to consistent demo bookings

No pitch. No fluff. Just clarity.

📅 → Book your session here: https://calendly.com/mnikolaou-toc/lets-talk-15min

Talk soon,
—Mike
COO, The Obsidian Co.™
mnikolaou@theobsidianco.com
www.theobsidianco.com`;
}

module.exports = {
  renderSaaSEmail,
  getSaaSEmailText
};