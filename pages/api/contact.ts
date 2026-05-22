import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { min: 5, max: 254 },
  subject: { min: 2, max: 150 },
  message: { min: 10, max: 5000 },
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type RateRecord = { count: number; resetAt: number };
const rateStore = new Map<string, RateRecord>();
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateStore.get(ip);

  if (!record || record.resetAt < now) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true };
  }
  if (record.count >= RATE_LIMIT.max) {
    return { ok: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
  }
  record.count += 1;
  return { ok: true };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    res.setHeader('Retry-After', String(rate.retryAfter ?? 3600));
    return res.status(429).json({ message: 'Trop de requêtes. Réessayez plus tard.' });
  }

  const body = req.body ?? {};
  const { name, email, subject, message, website } = body;

  if (typeof website === 'string' && website.trim().length > 0) {
    return res.status(200).json({ message: 'Email sent successfully' });
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string'
  ) {
    return res.status(400).json({ message: 'Champs invalides.' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (
    cleanName.length < LIMITS.name.min || cleanName.length > LIMITS.name.max ||
    cleanEmail.length < LIMITS.email.min || cleanEmail.length > LIMITS.email.max ||
    cleanSubject.length < LIMITS.subject.min || cleanSubject.length > LIMITS.subject.max ||
    cleanMessage.length < LIMITS.message.min || cleanMessage.length > LIMITS.message.max
  ) {
    return res.status(400).json({ message: 'Longueur des champs invalide.' });
  }

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ message: 'Adresse email invalide.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeSubject = escapeHtml(cleanSubject);
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br>');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'dolnickenzanza@gmail.com',
      replyTo: cleanEmail,
      subject: `Nouveau message Portfolio: ${cleanSubject}`,
      text: `Nom: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
      html: `
        <h3>Nouveau message de contact (Portfolio)</h3>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Sujet :</strong> ${safeSubject}</p>
        <h4>Message :</h4>
        <p>${safeMessage}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
