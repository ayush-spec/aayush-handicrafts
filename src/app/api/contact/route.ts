import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { message: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.CONTACT_EMAIL || 'hello@aayushhandicrafts.com';
    const fromEmail = process.env.CONTACT_EMAIL_FROM || 'noreply@aayushhandicrafts.com';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Contact: ${subject}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1F3A5F; margin-bottom: 20px;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #999; width: 80px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}" style="color: #1F3A5F;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0; color: #333;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #F4F6F8; border-radius: 4px;">
            <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Sent from the Aayush Handicrafts contact form. Reply directly to respond to ${name}.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend contact error:', error);
      return NextResponse.json(
        { message: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
