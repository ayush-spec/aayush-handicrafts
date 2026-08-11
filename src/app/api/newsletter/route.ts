import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { message: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Generate a unique discount code (you can customize this logic)
    const discountCode = `WELCOME10-${Date.now().toString(36).toUpperCase()}`;

    // Send welcome email with Resend
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'noreply@aayushhandicrafts.com',
      to: email,
      subject: 'Welcome to Aayush Handicrafts - Your 10% Discount Inside!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Aayush Handicrafts</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1F3A5F; font-size: 32px; margin-bottom: 10px;">Welcome to Aayush Handicrafts!</h1>
              <p style="font-size: 18px; color: #666;">Thank you for joining our community</p>
            </div>

            <div style="background-color: #F4F6F8; border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center;">
              <p style="font-size: 16px; margin-bottom: 15px;">Here's your exclusive discount code:</p>
              <div style="background-color: #1F3A5F; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; display: inline-block;">
                ${discountCode}
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 15px;">Use this code at checkout to get <strong>10% off</strong> your first order!</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">What to Expect</h2>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  ✨ <strong>Exclusive launches</strong> - Be the first to see new collections
                </li>
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  🎨 <strong>Behind-the-scenes</strong> - Watch our creative process
                </li>
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  💡 <strong>Silver care tips</strong> - Learn care and styling ideas
                </li>
                <li style="padding: 8px 0;">
                  🎁 <strong>Special offers</strong> - Members-only discounts and deals
                </li>
              </ul>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aayushhandicrafts.com'}/shop" style="display: inline-block; background-color: #1F3A5F; color: white; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
                Start Shopping
              </a>
            </div>

            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 14px; color: #999; margin-bottom: 10px;">
                We respect your privacy. You can unsubscribe anytime.
              </p>
              <p style="font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Aayush Handicrafts. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { message: 'Failed to send welcome email. Please try again.' },
        { status: 500 }
      );
    }

    // Optionally: Store email in Sanity or database here
    // For now, Resend keeps track of sent emails

    return NextResponse.json(
      {
        message: 'Successfully subscribed! Check your email for your discount code.',
        discountCode, // Return the code in case you want to display it immediately
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
