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

export async function sendOTPEmail(email: string, otp: string, name: string) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your StayBuddy account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${name},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Thanks for signing up! Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; background: #f3f4f6; border: 2px dashed #4f46e5; border-radius: 12px; padding: 16px 40px;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #4f46e5;">${otp}</span>
            </div>
          </div>
          <p style="color: #9ca3af; font-size: 13px; text-align: center;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
