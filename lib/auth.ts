import { createHmac, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { GetServerSidePropsContext } from 'next';

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-dev-secret-change-me';
const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 8; // 8 heures

// ── Token ────────────────────────────────────────────────────
function sign(payload: string): string {
  const mac = createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${mac}`;
}

function verify(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ── Cookie helpers ────────────────────────────────────────────
export function setSessionCookie(res: NextApiResponse) {
  const payload = `admin:${Date.now()}`;
  const token = sign(payload);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  );
}

export function clearSessionCookie(res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
}

// ── Session check ─────────────────────────────────────────────
export function getTokenFromRequest(req: NextApiRequest | GetServerSidePropsContext['req']): string | null {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export function isAuthenticated(req: NextApiRequest | GetServerSidePropsContext['req']): boolean {
  const token = getTokenFromRequest(req);
  return !!token && verify(token);
}
