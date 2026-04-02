import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, country } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Scope by country so /in and /fr accounts are separate
    const query: Record<string, string> = { email: email.toLowerCase() };
    if (country && ['fr', 'in'].includes(country)) query.country = country;

    // Find user by email (+ country if provided)
    const user = await User.findOne(query);
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in user document (in production, use Redis or similar)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Get the base URL from environment or request
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/${user.country}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: `"StayBuddy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - StayBuddy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - StayBuddy</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>You requested a password reset for your StayBuddy account</p>
          </div>

          <div class="content">
            <h2>Hello ${user.fullName},</h2>

            <p>You recently requested to reset your password for your StayBuddy account. Click the button below to reset your password:</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p><strong>This link will expire in 1 hour.</strong></p>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </div>

            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace;">${resetUrl}</p>

            <p>Best regards,<br>The StayBuddy Team</p>
          </div>

          <div class="footer">
            <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            <p>© 2024 StayBuddy. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset - StayBuddy

        Hello ${user.fullName},

        You requested a password reset for your StayBuddy account.

        Click this link to reset your password: ${resetUrl}

        This link will expire in 1 hour.

        If you didn't request this password reset, please ignore this email.

        Best regards,
        The StayBuddy Team
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'If an account with that email exists, a reset link has been sent.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Forgot password error:', error);

    return NextResponse.json(
      { error: 'Failed to send reset email. Please try again.' },
      { status: 500 }
    );
  }
}