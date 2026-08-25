import crypto from 'crypto';
import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nipun2026';
const AUTH_SECRET = process.env.AUTH_SECRET || 'nipun_certificate_portfolio_super_secret_key_2026_jwt_auth_hash';
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Validates the admin passcode against environment variable / default.
 */
export const validateAdminPasscode = (passcode: string): boolean => {
  if (!passcode || typeof passcode !== 'string') return false;
  return passcode === ADMIN_PASSWORD;
};

/**
 * Creates a cryptographically signed HMAC token for the admin session.
 */
export const createAdminToken = (): string => {
  const timestamp = Date.now();
  const payload = `admin:${timestamp}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}:${signature}`;
};

/**
 * Verifies that an admin token is authentic and not expired.
 */
export const verifyAdminToken = (token: string | null | undefined): boolean => {
  if (!token) return false;

  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;

    const [role, timestampStr, signature] = parts;
    if (role !== 'admin') return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check expiry (7 days)
    const now = Date.now();
    if (now - timestamp > SESSION_MAX_AGE_SECONDS * 1000) {
      return false;
    }

    // Recompute signature and compare
    const expectedPayload = `admin:${timestampStr}`;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(expectedPayload).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (err) {
    return false;
  }
};

/**
 * Verifies if the incoming request has a valid admin session via cookie or Authorization header.
 */
export const verifyAdminSession = (req: NextRequest | Request): boolean => {
  // Check cookie in NextRequest
  if ('cookies' in req && typeof req.cookies?.get === 'function') {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME);
    if (cookie && verifyAdminToken(cookie.value)) {
      return true;
    }
  }

  // Check Cookie header
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]*)`));
    if (match && match[1] && verifyAdminToken(decodeURIComponent(match[1]))) {
      return true;
    }
  }

  // Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (verifyAdminToken(token)) {
      return true;
    }
  }

  return false;
};

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
