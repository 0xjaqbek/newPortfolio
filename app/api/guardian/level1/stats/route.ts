import { NextRequest, NextResponse } from 'next/server';
import { securityAudit } from '@/lib/security/security-audit.service';
import { getSessionId, getIpAddress, getUserAgent } from '@/lib/security/session';

export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);

    // Log Level 1 access
    await securityAudit.logLevel1Access(sessionId, ipAddress, userAgent);

    // Get statistics
    const stats = await securityAudit.getStatistics();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
