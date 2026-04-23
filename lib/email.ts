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
  propertyType: string,
  pgName: string,
  societyName: string,
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
    subject: `New Booking Request for "${propertyType === "PG" ? pgName : societyName}""`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${ownerName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            You have a new booking request for your property <strong style="color: #111827;">${propertyType === "PG" ? pgName : societyName}"</strong>.
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

export async function sendPropertyRequestEmail(
  ownerName: string,
  ownerEmail: string,
  propertyTitle: string,
  propertyType: string,
  pgName: string,
  societyName: string,
  location: string,
  price: number,
  hasVerificationDocs: boolean,
  adminDashboardUrl: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Property Request — "${propertyType === "PG" ? pgName : societyName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">New Property Listing Request</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            A new property has been submitted and is awaiting your review.
          </p>

          <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #374151; font-size: 14px; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.05em;">Property Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 140px;">Title</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${propertyTitle}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Type</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${propertyType}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Location</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${location}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Price</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">₹${price.toLocaleString()} / month</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Verification Docs</td><td style="padding: 6px 0; font-weight: 600; font-size: 14px; color: ${hasVerificationDocs ? '#16a34a' : '#9ca3af'};">${hasVerificationDocs ? '✓ Uploaded' : 'Not uploaded'}</td></tr>
            </table>
          </div>

          <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #374151; font-size: 14px; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.05em;">Owner Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 140px;">Name</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${ownerName}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">${ownerEmail}</td></tr>
            </table>
          </div>

          <div style="text-align: center;">
            <a href="${adminDashboardUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Review in Admin Dashboard
            </a>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — Admin notification
        </p>
      </div>
    `,
  });
}

export async function sendPropertyApprovedEmail(
  ownerEmail: string,
  ownerName: string,
  propertyUrl: string,
  propertyType:string,
  pgName: string,
  societyName: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `🎉 Your property "${propertyType === "PG" ? pgName : societyName}" has been approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${ownerName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Great news! Your property listing <strong style="color: #111827;">${propertyType === "PG" ? pgName : societyName}</strong> has been
            <strong style="color: #16a34a;">approved</strong> by our team and is now live on StayBuddy.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: #15803d; font-size: 16px; font-weight: 600; margin: 0;">✓ Your property is now visible to tenants</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${propertyUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              View Your Listing
            </a>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — You're receiving this because you submitted a property listing.
        </p>
      </div>
    `,
  });
}

export async function sendPropertyVerifiedEmail(
  ownerEmail: string,
  ownerName: string,
  propertyType:string,
  pgName: string,
  societyName: string,
  propertyUrl: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `✅ Your property "${propertyType === "PG" ? pgName : societyName}" is now Verified!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${ownerName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Your property <strong style="color: #111827;">${propertyType === "PG" ? pgName : societyName}</strong> has been
            <strong style="color: #059669;">verified</strong> by our team.
            It now displays a <strong>Verified badge</strong> on the listing, increasing trust with potential tenants.
          </p>
          <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: #065f46; font-size: 16px; font-weight: 600; margin: 0;">✅ Verified Badge Added to Your Listing</p>
            <p style="color: #047857; font-size: 13px; margin: 8px 0 0 0;">Tenants can now see your property is verified and trustworthy.</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${propertyUrl}" style="display: inline-block; background: #059669; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              View Verified Listing
            </a>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — You're receiving this because you submitted a property listing.
        </p>
      </div>
    `,
  });
}

export async function sendAccountBlockedEmail(
  userEmail: string,
  userName: string,
  reason: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Your StayBuddy account has been suspended`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${userName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Your StayBuddy account has been <strong style="color: #dc2626;">suspended</strong> by our admin team.
          </p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #991b1b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Reason</h3>
            <p style="color: #7f1d1d; font-size: 15px; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you believe this is a mistake, please contact our support team by replying to this email.
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — Account notification
        </p>
      </div>
    `,
  });
}

// ─── Subscriber Emails ────────────────────────────────────────────────────────

export async function sendPropertyDeletedEmail(
  ownerEmail: string,
  ownerName: string,
  propertyType:string,
  pgName: string,
  societyName: string,
  reason: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `Your listing "${propertyType === "PG" ? pgName : societyName}" has been removed`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${ownerName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Your property listing <strong style="color: #111827;">${propertyType === "PG" ? pgName : societyName}</strong> has been
            <strong style="color: #dc2626;">removed</strong> from StayBuddy by our admin team.
          </p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #991b1b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Reason for Removal</h3>
            <p style="color: #7f1d1d; font-size: 15px; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you believe this was done in error, please contact our support team by replying to this email.
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — Listing notification
        </p>
      </div>
    `,
  });
}

export async function sendSubscribeConfirmationEmail(
  email: string,
  city?: string,
  propertyType?: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const prefsText = [city, propertyType].filter(Boolean).join(' · ') || 'All properties';

  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '✅ You\'re subscribed to StayBuddy alerts!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#4f46e5;font-size:28px;margin:0;">StayBuddy</h1>
        </div>
        <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color:#111827;font-size:20px;margin-top:0;">You're all set! 🎉</h2>
          <p style="color:#6b7280;line-height:1.6;">
            You'll now receive instant alerts when new properties matching your preferences become available.
          </p>
          <div style="background:#eff6ff;border-radius:10px;padding:16px;margin:20px 0;">
            <p style="color:#1e40af;font-size:14px;margin:0;font-weight:600;">Your preferences: ${prefsText}</p>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            Don't want alerts? <a href="${unsubscribeUrl}" style="color:#4f46e5;">Unsubscribe here</a>
          </p>
        </div>
      </div>
    `,
  });
}

/**
 * Send new property alert to matching subscribers.
 * Batches sends to avoid overwhelming the SMTP server.
 */
export async function sendNewPropertyEmail(property: {
  _id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  country?: string;
  pgName?: string;
  societyName?: string;
}) {
  const Subscriber = (await import('@/models/Subscriber')).default;
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const country = property.country || 'in';
  const propertyUrl = `${baseUrl}/${country}/property/${property._id}`;

  // Build smart filter
  const filter: Record<string, any> = { isActive: true, country: country };
  const orConditions: any[] = [
    { 'preferences.city': { $exists: false } },
    { 'preferences.city': '' },
    { 'preferences.city': null },
  ];
  if (property.location) orConditions.push({ 'preferences.city': new RegExp(property.location, 'i') });

  const typeOrConditions: any[] = [
    { 'preferences.propertyType': { $exists: false } },
    { 'preferences.propertyType': null },
  ];
  if (property.propertyType) typeOrConditions.push({ 'preferences.propertyType': property.propertyType });

  filter.$and = [{ $or: orConditions }, { $or: typeOrConditions }];

  const subscribers = await Subscriber.find(filter).select('email').lean() as any[];
  if (subscribers.length === 0) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#4f46e5;font-size:28px;margin:0;">StayBuddy</h1>
      </div>
      <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="color:#111827;font-size:20px;margin-top:0;">New Property Available! 🏠</h2>
        <p style="color:#6b7280;line-height:1.6;">A new listing matching your preferences just went live.</p>
        <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin:20px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:120px;">Property</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${property.propertyType === "PG" ? property.pgName : property.societyName}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Location</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${property.location}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Type</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${property.propertyType}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Price</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">₹${property.price.toLocaleString()} / month</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${propertyUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            View Property →
          </a>
        </div>
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px;">
        You're receiving this because you subscribed to StayBuddy alerts.
        <a href="${baseUrl}/api/unsubscribe?email=__EMAIL__" style="color:#4f46e5;">Unsubscribe</a>
      </p>
    </div>
  `;

  // Send in batches of 50 to avoid SMTP rate limits
  const BATCH = 50;
  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH);
    await Promise.allSettled(
      batch.map((sub: any) =>
        transporter.sendMail({
          from: `"StayBuddy" <${process.env.SMTP_USER}>`,
          to: sub.email,
          subject: `New ${property.propertyType} in ${property.location} — StayBuddy`,
          html: html.replace('__EMAIL__', encodeURIComponent(sub.email)),
        })
      )
    );
  }
}

/**
 * Send vacancy alert to matching subscribers.
 * Triggered when a property's available rooms increase.
 */
export async function sendVacancyAlert(property: {
  _id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  country?: string;
  pgName?: string;
  societyName?: string;
}) {
  const Subscriber = (await import('@/models/Subscriber')).default;
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const country = property.country || 'in';
  const propertyUrl = `${baseUrl}/${country}/property/${property._id}`;

  const filter: Record<string, any> = { isActive: true, country: country };
  const orConditions: any[] = [
    { 'preferences.city': { $exists: false } },
    { 'preferences.city': '' },
    { 'preferences.city': null },
  ];
  if (property.location) orConditions.push({ 'preferences.city': new RegExp(property.location, 'i') });

  const typeOrConditions: any[] = [
    { 'preferences.propertyType': { $exists: false } },
    { 'preferences.propertyType': null },
  ];
  if (property.propertyType) typeOrConditions.push({ 'preferences.propertyType': property.propertyType });

  filter.$and = [{ $or: orConditions }, { $or: typeOrConditions }];

  const subscribers = await Subscriber.find(filter).select('email').lean() as any[];
  if (subscribers.length === 0) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#4f46e5;font-size:28px;margin:0;">StayBuddy</h1>
      </div>
      <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="background:#fef3c7;border-radius:10px;padding:12px 16px;margin-bottom:20px;text-align:center;">
          <p style="color:#92400e;font-weight:700;font-size:15px;margin:0;">🔔 Room Available Now!</p>
        </div>
        <h2 style="color:#111827;font-size:20px;margin-top:0;">A room just opened up</h2>
        <p style="color:#6b7280;line-height:1.6;">A vacancy matching your preferences is now available. Act fast — rooms fill up quickly!</p>
        <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin:20px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:120px;">Property</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${property.propertyType === "PG" ? property.pgName : property.societyName}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Location</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${property.location}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Type</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">${property.propertyType}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Price</td><td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;">₹${property.price.toLocaleString()} / month</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${propertyUrl}" style="display:inline-block;background:#f59e0b;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
            Book Now →
          </a>
        </div>
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px;">
        You're receiving this because you subscribed to StayBuddy alerts.
        <a href="${baseUrl}/api/unsubscribe?email=__EMAIL__" style="color:#4f46e5;">Unsubscribe</a>
      </p>
    </div>
  `;

  const BATCH = 50;
  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH);
    await Promise.allSettled(
      batch.map((sub: any) =>
        transporter.sendMail({
          from: `"StayBuddy" <${process.env.SMTP_USER}>`,
          to: sub.email,
          subject: `🔔 Room Available Now — ${property.title} in ${property.location}`,
          html: html.replace('__EMAIL__', encodeURIComponent(sub.email)),
        })
      )
    );
  }
}

export async function sendPropertyRejectedEmail(
  ownerEmail: string,
  ownerName: string,
  propertyTitle: string,
  pgName: string,
  societyName: string,
  propertyType: string,
  reason: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `Your property "${propertyTitle}" was not approved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${ownerName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Thank you for submitting your property <strong style="color: #111827;">${propertyType === "PG" ? pgName : societyName}</strong> to StayBuddy.
            After review, our team was unable to approve this listing at this time.
          </p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #991b1b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Reason</h3>
            <p style="color: #7f1d1d; font-size: 15px; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            You're welcome to address the issue and resubmit your listing. If you have questions, please reply to this email.
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — You're receiving this because you submitted a property listing.
        </p>
      </div>
    `,
  });
}

export async function sendChatMessageEmail(
  receiverEmail: string,
  receiverName: string,
  senderName: string,
  propertyType: string,
  pgName: string,
  societyName: string,
  messagePreview: string,
  dashboardUrl: string
) {
  await transporter.sendMail({
    from: `"StayBuddy" <${process.env.SMTP_USER}>`,
    to: receiverEmail,
    subject: `New message from ${senderName} — StayBuddy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">StayBuddy</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Hi ${receiverName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            You have a new message from <strong style="color: #111827;">${senderName}</strong>
            regarding <strong style="color: #111827;">${propertyType === "PG" ? pgName : societyName}</strong>.
          </p>
          <div style="background: #f3f4f6; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0; padding: 16px; margin: 24px 0;">
            <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;">"${messagePreview}"</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${dashboardUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Reply in Dashboard
            </a>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          © StayBuddy — You're receiving this because you have an active conversation.
        </p>
      </div>
    `,
  });
}
