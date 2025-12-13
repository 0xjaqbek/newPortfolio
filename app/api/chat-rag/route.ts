import { NextRequest, NextResponse } from 'next/server';
import { getSessionId, getIpAddress, getUserAgent } from '@/lib/security/session';
import { securityAudit } from '@/lib/security/security-audit.service';
import { createRateLimitMiddleware } from '@/lib/security/rate-limit';

const chatRateLimit = createRateLimitMiddleware(
  parseInt(process.env.RATE_LIMIT_CHAT_REQUESTS || '20'),
  parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60')
);

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Extract session info
    const sessionId = getSessionId(request);
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);

    // Check IP block
    const ipBlockStatus = await securityAudit.isIpBlocked(ipAddress);
    if (ipBlockStatus.blocked) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: `Your IP has been blocked. Reason: ${ipBlockStatus.reason}`,
        },
        { status: 403 }
      );
    }

    // Check session suspension
    const suspensionStatus = await securityAudit.isSessionSuspended(sessionId);
    if (suspensionStatus.suspended) {
      const sendConsoleHint = process.env.SEND_CONSOLE_HINTS === 'true';
      const expiresText = suspensionStatus.expiresAt
        ? `Come back after ${suspensionStatus.expiresAt.toLocaleString()}`
        : 'This block is permanent.';

      let consoleHint = '';
      if (sendConsoleHint) {
        consoleHint = '\n\n💡 Curious about what triggered this? Check your browser console...';
      }

      return NextResponse.json(
        {
          error: 'Access suspended',
          message: `Access temporarily restricted. ${expiresText}\n\nReason: ${suspensionStatus.reason}${consoleHint}`,
        },
        { status: 403 }
      );
    }

    // Rate limiting
    try {
      chatRateLimit(sessionId);
    } catch (rateLimitError: any) {
      await securityAudit.logEvent({
        sessionId,
        ipAddress,
        userAgent,
        activityType: 'RATE_LIMIT_EXCEEDED',
        severity: 'MEDIUM',
        details: { endpoint: '/api/chat-rag' },
      });

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: rateLimitError.message,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Forward request to Python RAG service
    const ragResponse = await fetch(`${RAG_SERVICE_URL}/api/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        use_rag: true,
      }),
    });

    if (!ragResponse.ok) {
      throw new Error(`RAG service error: ${ragResponse.status}`);
    }

    const data = await ragResponse.json();

    // Create response with session cookie
    const jsonResponse = NextResponse.json({
      message: data.response,
      metadata: data.metadata,
    });

    jsonResponse.cookies.set('guardian_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return jsonResponse;
  } catch (error) {
    console.error('RAG Chat API error:', error);
    return NextResponse.json(
      {
        message: 'ERROR: Unable to process your request with RAG assistant. Please try again later.',
      },
      { status: 500 }
    );
  }
}
