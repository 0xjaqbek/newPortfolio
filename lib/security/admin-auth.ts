/**
 * Admin authentication utilities
 */

import { NextRequest } from 'next/server';

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_MASTER_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_MASTER_PASSWORD not set in environment');
    return false;
  }

  return password === adminPassword;
}

/**
 * Extract and verify admin token from request
 */
export function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return verifyAdminPassword(token);
}
