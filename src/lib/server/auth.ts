import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { verifyToken, type JWTPayload } from '$lib/server/utils/jwt';

export function requireAuth(event: RequestEvent): JWTPayload {
  const token = event.cookies.get('token');
  if (!token) {
    throw error(401, 'Unauthorized');
  }
  const payload = verifyToken(token);
  if (!payload) {
    throw error(401, 'Invalid token');
  }
  return payload;
}

export function requireRole(event: RequestEvent, roles: Array<JWTPayload['role']>): JWTPayload {
  const user = requireAuth(event);
  if (!roles.includes(user.role)) {
    throw error(403, 'Forbidden');
  }
  return user;
}


