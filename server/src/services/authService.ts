import crypto from 'crypto';
import { supabase, toValidUUID } from './supabaseService.js';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: 'traveler' | 'admin';
  phone?: string;
  city?: string;
  country?: string;
  avatar?: string;
  created_at?: string;
}

export interface UserRecord extends UserPayload {
  password_hash: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-super-secret-jwt-key-2026';
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Pre-seeded Demo Accounts
export const inMemoryUsers: Map<string, UserRecord> = new Map();

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function comparePassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    // Backward compatibility with plain text demo passwords if any
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(':');
  const hashedBuffer = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');
  return crypto.timingSafeEqual(hashedBuffer, keyBuffer);
}

// Seed default users
(function initDefaultUsers() {
  const traveler: UserRecord = {
    id: 'traveler-123',
    email: 'traveler@globetrotter.io',
    password_hash: hashPassword('password123'),
    name: 'Jane Traveler',
    role: 'traveler',
    city: 'San Francisco',
    country: 'United States',
    phone: '+1 (555) 234-5678',
    avatar: 'JT',
    created_at: new Date('2024-01-15').toISOString(),
  };

  const admin: UserRecord = {
    id: 'demo-admin',
    email: 'admin@globetrotter.io',
    password_hash: hashPassword('adminpassword'),
    name: 'System Admin',
    role: 'admin',
    avatar: 'SA',
    created_at: new Date('2024-01-01').toISOString(),
  };

  inMemoryUsers.set(traveler.email.toLowerCase(), traveler);
  inMemoryUsers.set(admin.email.toLowerCase(), admin);
})();

// Base64URL helpers for JWT
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

// Generate HS256 JWT Token
export function generateToken(user: UserPayload): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Date.now();
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + TOKEN_EXPIRY_MS) / 1000),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${signature}`;
}

// Verify HS256 JWT Token
export function verifyToken(token: string): UserPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(dataToSign)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const nowSec = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < nowSec) {
      return null; // Expired
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'traveler',
    };
  } catch (e) {
    return null;
  }
}

// User lookup
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.toLowerCase().trim();

  // Try Supabase if configured
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        email: data.email,
        password_hash: data.password_hash || data.password,
        name: data.name || data.raw_user_meta_data?.name || cleanEmail.split('@')[0],
        role: data.role || 'traveler',
        phone: data.phone,
        city: data.city,
        country: data.country,
        avatar: data.avatar || cleanEmail.slice(0, 2).toUpperCase(),
        created_at: data.created_at,
      };
    }
  } catch (_) {}

  // Fallback to in-memory store
  return inMemoryUsers.get(cleanEmail) || null;
}

// User creation
export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  city?: string;
  country?: string;
  role?: 'traveler' | 'admin';
}): Promise<UserRecord> {
  const cleanEmail = data.email.toLowerCase().trim();
  const userId = `user-${Date.now()}`;
  const passwordHash = hashPassword(data.password);
  const role = data.role || (cleanEmail.includes('admin') ? 'admin' : 'traveler');

  const newUser: UserRecord = {
    id: userId,
    email: cleanEmail,
    password_hash: passwordHash,
    name: data.name || cleanEmail.split('@')[0],
    role,
    phone: data.phone || '',
    city: data.city || 'San Francisco',
    country: data.country || 'United States',
    avatar: (data.name || cleanEmail).slice(0, 2).toUpperCase(),
    created_at: new Date().toISOString(),
  };

  inMemoryUsers.set(cleanEmail, newUser);

  // Attempt Supabase insert if available
  try {
    const validUuid = toValidUUID(userId);
    await supabase.from('users').insert({
      id: validUuid || undefined,
      email: cleanEmail,
      password_hash: passwordHash,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      city: newUser.city,
      country: newUser.country,
    });
  } catch (_) {}

  return newUser;
}
