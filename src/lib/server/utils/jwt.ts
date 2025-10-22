import jwt from "jsonwebtoken"
import {JWT_SECRET, TOKEN_EXPIRY} from "$env/static/private"

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  nama: string;
  iat?: number;
  exp?: number;
}

export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: TOKEN_EXPIRY})
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}