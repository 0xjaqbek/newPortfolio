/**
 * Session utilities for tracking users without auth
 */

import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * Extract session ID from request (from cookie or generate new)
 */
export function getSessionId(request: NextRequest): string {
  // Try to get from cookie
  const sessionCookie = request.cookies.get('guardian_session');

  if (sessionCookie?.value) {
    return sessionCookie.value;
  }

  // Generate new session ID
  return generateSessionId();
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Extract IP address from request
 */
export function getIpAddress(request: NextRequest): string {
  // Try various headers for reverse proxy scenarios
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback (won't work in production, but useful for dev)
  return 'unknown';
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string | undefined {
  return request.headers.get('user-agent') || undefined;
}
