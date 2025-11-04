// Function to get the HTML email template for fashion funnel
function getFashionEmailTemplate() {
  return `<!DOCTYPE html>
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
    }

    .content {
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
    }

    .download-cta-box a {
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
      </div>

      <!-- What's Inside -->
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
</html>`;
}

// Function to render the email template with dynamic data (if needed in the future)
function renderFashionEmail() {
  return getFashionEmailTemplate();
}

// Function to get plain text version of the email
function getFashionEmailText() {
  return `Your Fashion Campaign Framework

A Ready-to-Implement System That Increased ROAS by 74% in 90 Days

Hey!

Here's the download you requested — A Ready-to-Implement Fashion Campaign That Can Increase Your ROAS by 74% in 90 Days with Near-zero Production Costs.

📥 Download Your Campaign Framework
https://drive.google.com/drive/folders/1fwImxLIDpMFVFhUwtAh5q4ycLAmUI6hK?usp=drive_link

Inside, you'll find:
• How a footwear brand scaled 74% ROAS without increasing spend
• How Kipling achieved 16.9× ROAS with a creative rotation system
• Why most fashion campaigns plateau after Month 2 — and how to fix it

No sales pitch. No follow-up ask. Just the same campaign framework we use internally to scale fashion brands profitably with minimal production costs.

Read it. Apply it. Watch how a proven system outperforms expensive creative every time.

Talk soon,
— Mike, COO
The Obsidian Co.

Want us to apply this campaign to your account?
📅 Book a Free Scale Session: https://calendly.com/mnikolaou-toc/digital-marketing-branding-fashion-industry

—
The Obsidian Co | Performance Marketing Agency
You're receiving this because you downloaded our Fashion Campaign Framework.`;
}

module.exports = {
  renderFashionEmail,
  getFashionEmailText
};
