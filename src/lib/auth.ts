import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const rawSecret = process.env.NEXTAUTH_SECRET;
if (!rawSecret) {
  throw new Error(
    'NEXTAUTH_SECRET belum diset di .env! Jangan jalankan server tanpa konfigurasi ini.'
  );
}
const JWT_SECRET = new TextEncoder().encode(rawSecret);

export interface SessionUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function encrypt(payload: SessionUser) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);
}

export async function decrypt(input: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(input, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function login(user: SessionUser) {
  const encryptedSession = await encrypt(user);
  const cookieStore = await cookies();
  cookieStore.set('session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60 * 60, // 2 hours
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
