import { NextRequest, NextResponse } from 'next/server';
import { securityAudit } from '@/lib/security/security-audit.service';
import { getSessionId, getIpAddress, getUserAgent } from '@/lib/security/session';

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);

    await securityAudit.logConsoleAccess(sessionId, ipAddress, userAgent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Console access log error:', error);
    return NextResponse.json({ error: 'Failed to log access' }, { status: 500 });
  }
}
