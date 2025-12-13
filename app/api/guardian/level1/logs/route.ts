import { NextRequest, NextResponse } from 'next/server';
import { securityAudit } from '@/lib/security/security-audit.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get recent logs
    const logs = await securityAudit.getRecentLogs(limit);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Logs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
