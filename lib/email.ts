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

export async function sendBookingRequestEmail(
  ownerEmail: string,
  ownerName: string,
  renterName: string,
  renterPhone: string,
  propertyTitle: string,
  details: {
    roomType: string;
    moveInDate: string;
    stayDuration: string;
    occupation: string;
    budgetRange: string;
    message: string;
  }
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `New Booking Request for "${propertyTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${ownerName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            You have a new booking request for your property <strong style="color: #111827;">${propertyTitle}</strong>.
          </p>

          <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #374151; font-size: 15px; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em;">Renter Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 140px;">Name</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${renterName}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${renterPhone}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Room Type</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${details.roomType}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Move-in Date</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${details.moveInDate}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Stay Duration</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${details.stayDuration}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Occupation</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${details.occupation}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Budget</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${details.budgetRange}</td></tr>
            </table>
          </div>

          ${details.message ? `
          <div style="background: #eff6ff; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 24px;">
            <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;"><strong>Message:</strong> ${details.message}</p>
          </div>` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #6b7280; font-size: 13px;">Log in to your StayBuddy dashboard to accept or reject this request.</p>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — You're receiving this because you're a registered property owner.
        </p>
      </div>
    `,
  });
}

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

export async function sendChatMessageEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  propertyTitle: string,
  messageText: string,
  dashboardUrl: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: `New message from ${senderName} — "${propertyTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${recipientName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            You have a new message from <strong style="color: #111827;">${senderName}</strong> regarding
            <strong style="color: #111827;">${propertyTitle}</strong>.
          </p>
          <div style="background: #eff6ff; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0; padding: 16px; margin: 24px 0;">
            <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.6;">${messageText}</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${dashboardUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Reply in Dashboard
            </a>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — You're receiving this because you have an active inquiry.
        </p>
      </div>
    `,
  });
}
