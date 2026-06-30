import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT) || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export async function sendEmail({ to, subject, html }) {
	if (!process.env.SMTP_USER) {
		console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
		return { success: true, mock: true };
	}

	await transporter.sendMail({
		from: process.env.SMTP_FROM || "CipherShield <noreply@ciphershield.com>",
		to,
		subject,
		html,
	});

	return { success: true };
}

export function verificationEmailHtml(name, token) {
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
	return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4;">Verify Your Email — CipherShield</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email address to activate your CipherShield account.</p>
      <a href="${url}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
  `;
}

export function resetPasswordEmailHtml(name, token) {
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
	return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4;">Reset Your Password — CipherShield</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click below to proceed.</p>
      <a href="${url}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
      <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `;
}
