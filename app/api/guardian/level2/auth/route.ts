import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/security/admin-auth';
import { securityAudit } from '@/lib/security/security-audit.service';
import { getSessionId, getIpAddress, getUserAgent } from '@/lib/security/session';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);

    if (!isValid) {
      // Log failed attempt
      const sessionId = getSessionId(request);
      const ipAddress = getIpAddress(request);
      const userAgent = getUserAgent(request);

      await securityAudit.logEvent({
        sessionId,
        ipAddress,
        userAgent,
        activityType: 'ADMIN_AUTH_FAILED',
        severity: 'HIGH',
        details: { attempt: 'level2_access' },
      });

      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Log successful Level 2 access
    const sessionId = getSessionId(request);
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);

    await securityAudit.logLevel2Access(sessionId, ipAddress, userAgent);

    return NextResponse.json({
      success: true,
      token: password, // Use password as token (simple approach)
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
