import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/admin-auth';

/**
 * Get security configuration
 */
export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = {
      securityMode: process.env.SECURITY_MODE || 'strict',
      inputMaxLength: parseInt(process.env.INPUT_MAX_LENGTH || '2000'),
      injectionThreshold: parseInt(process.env.INJECTION_THRESHOLD || '5'),
      suspensionDurationHours: parseInt(process.env.SUSPENSION_DURATION_HOURS || '48'),
      enableFakeBreaches: process.env.ENABLE_FAKE_BREACH_RESPONSES === 'true',
      sendConsoleHints: process.env.SEND_CONSOLE_HINTS === 'true',
      rateLimitChatRequests: parseInt(process.env.RATE_LIMIT_CHAT_REQUESTS || '20'),
      rateLimitWindowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60'),
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Config API error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}
