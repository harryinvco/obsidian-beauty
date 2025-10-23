const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmails() {
  const testEmail = 'Harry@innovaco.com.cy';
  const firstName = 'Harry';

  console.log('🚀 Sending test emails to:', testEmail);

  try {
    // Send eCom email
    console.log('\n📧 Sending eCom email...');
    const ecomResponse = await resend.emails.send({
      from: 'Mike from The Obsidian Co <mike@theobsidianco.com>',
      to: [testEmail],
      subject: '🎯 Your eCom Growth Leak Checklist is Ready! [TEST]',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your eCom Growth Leak Checklist is Ready!</title>
    <style>
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Light mode - default colors */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
            color: #1e293b;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #3380AB 0%, #6CAA33 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            opacity: 1;
        }
        
        .header p {
            font-size: 16px;
            opacity: 1;
            color: #ffffff;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .content {
            padding: 40px 30px;
            background: #ffffff;
            color: #1e293b;
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
            color: #374151;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3380AB 0%, #6CAA33 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(51, 128, 171, 0.3);
            transition: all 0.3s ease;
            border: none;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(51, 128, 171, 0.4);
            color: #ffffff;
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
        
        .pro-tip-text {
            font-size: 16px;
            color: #374151;
            margin: 0;
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
            color: #374151;
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
            transition: all 0.3s ease;
        }
        
        .secondary-cta:hover {
            background: #3380AB;
            color: #ffffff;
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
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1e293b;
                color: #f1f5f9;
            }
            
            .email-container {
                background: #1f2937;
            }
            
            .content {
                background: #1f2937;
                color: #e5e7eb;
            }
            
            .greeting {
                color: #f1f5f9;
            }
            
            .main-text {
                color: #d1d5db;
            }
            
            .pro-tip {
                background: linear-gradient(135deg, rgba(108, 170, 51, 0.15) 0%, rgba(51, 128, 171, 0.15) 100%);
                border-left-color: #6CAA33;
            }
            
            .pro-tip-title {
                color: #f1f5f9;
            }
            
            .pro-tip-text {
                color: #d1d5db;
            }
            
            .options-section {
                background: #1f2937;
                border-color: #374151;
            }
            
            .options-title {
                color: #f1f5f9;
            }
            
            .option {
                color: #d1d5db;
            }
            
            .signature-name {
                color: #f1f5f9;
            }
            
            .signature-title {
                color: #9ca3af;
            }
            
            .signature-contact {
                color: #9ca3af;
            }
            
            .footer {
                background: #111827;
                color: #9ca3af;
            }
            
            /* Email client compatibility for dark mode */
            [data-ogsc] .header, [data-ogsc] .header h1, [data-ogsc] .header p {
                color: #ffffff;
            }
            
            [data-ogsc] .cta-button {
                color: #ffffff;
                background: #3380AB;
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
            <div class="greeting">Hey ${firstName},</div>
            
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
                <p class="pro-tip-text">Most stores are bleeding money in 2–3 key areas — usually in the first 10 questions. Run through the checklist now (takes 10–15 mins) and score yourself honestly.</p>
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
</html>`,
      text: `Hey ${firstName},

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
    console.log('✅ eCom email sent:', ecomResponse);

    // Send Fashion email
    console.log('\n📧 Sending Fashion email...');
    const fashionResponse = await resend.emails.send({
      from: 'Mike at The Obsidian Co <hello@theobsidianco.com>',
      to: [testEmail],
      subject: `Here's your download — A Ready-to-Implement Fashion Campaign That Increased ROAS by 74% [TEST]`,
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
        </html>
      `
    });
    console.log('✅ Fashion email sent:', fashionResponse);

    console.log('\n✨ Both test emails sent successfully!');
    console.log('📨 Check inbox at Harry@innovaco.com.cy');
    console.log('\n💡 Tips for viewing:');
    console.log('- Check both Light Mode and Dark Mode settings in your email client');
    console.log('- Gmail: Settings > Display density / Theme');
    console.log('- Outlook: File > Options > General > Color Mode');

  } catch (error) {
    console.error('❌ Error sending emails:', error);
    process.exit(1);
  }
}

sendTestEmails();
