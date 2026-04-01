import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"StayBuddy Contact" <${process.env.SMTP_USER}>`,
      to: 'staybuddy2026@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#4f46e5;font-size:28px;margin:0;">StayBuddy</h1>
            <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color:#111827;font-size:18px;margin-top:0;border-bottom:2px solid #f3f4f6;padding-bottom:12px;">
              ${subject}
            </h2>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <tr>
                <td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;vertical-align:top;">Name</td>
                <td style="padding:8px 0;color:#111827;font-weight:600;font-size:14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Email</td>
                <td style="padding:8px 0;font-size:14px;">
                  <a href="mailto:${email}" style="color:#4f46e5;font-weight:600;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Phone</td>
                <td style="padding:8px 0;font-size:14px;">
                  <a href="tel:${phone}" style="color:#4f46e5;font-weight:600;">${phone}</a>
                </td>
              </tr>
            </table>
            <div style="background:#eff6ff;border-left:4px solid #4f46e5;border-radius:0 8px 8px 0;padding:16px;margin-top:8px;">
              <p style="color:#374151;font-size:14px;margin:0;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
              <p style="color:#15803d;font-size:13px;margin:0;">
                💡 Reply directly to this email to respond to ${name} at <strong>${email}</strong>
              </p>
            </div>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px;">
            © StayBuddy — Contact form submission received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[POST /api/contact]', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
