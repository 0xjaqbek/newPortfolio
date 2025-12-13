import { NextRequest, NextResponse } from 'next/server';
import { chatWithDeepSeek } from '@/lib/ai/deepseek';
import { buildSystemPrompt } from '@/lib/ai/systemPrompt';
import { loadProfile, loadKnowledgeBase, loadPrivateReadmes } from '@/lib/knowledge/profile';
import { fetchPublicRepos } from '@/lib/github/repos';
import { inputSanitization } from '@/lib/security/input-sanitization.service';
import { securityAudit } from '@/lib/security/security-audit.service';
import { createRateLimitMiddleware } from '@/lib/security/rate-limit';
import { getSessionId, getIpAddress, getUserAgent } from '@/lib/security/session';

const chatRateLimit = createRateLimitMiddleware(
  parseInt(process.env.RATE_LIMIT_CHAT_REQUESTS || '20'),
  parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60')
);

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

      // Send console hint on 5th attempt block
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
        details: { endpoint: '/api/chat' },
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

    // Get last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 });
    }

    // Get attempt count for fake breach response
    const attemptCount = await securityAudit.getAttemptCount(sessionId);

    // Sanitize input
    const sanitizationResult = inputSanitization.sanitize(lastUserMessage.content, attemptCount + 1);

    // If flagged, log security event
    if (sanitizationResult.flagged) {
      await securityAudit.logEvent({
        sessionId,
        ipAddress,
        userAgent,
        activityType: 'PROMPT_INJECTION_ATTEMPT',
        severity: sanitizationResult.severity,
        details: {
          patterns: sanitizationResult.detectedPatterns,
          originalMessage: lastUserMessage.content,
          attemptNumber: attemptCount + 1,
        },
      });

      // Update statistics
      // Note: This is handled inside logEvent -> checkSuspensionThreshold

      // If fake breach responses enabled, return fake breach
      if (sanitizationResult.fakeBreachResponse) {
        const response = NextResponse.json({
          message: sanitizationResult.fakeBreachResponse,
          flagged: true,
        });

        // Set session cookie
        response.cookies.set('guardian_session', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
      }

      // If should block (strict mode + high severity)
      if (sanitizationResult.shouldBlock) {
        return NextResponse.json(
          {
            error: 'Content blocked',
            message: 'Your message was flagged by security filters. Please try rephrasing.',
          },
          { status: 400 }
        );
      }
    }

    // Load all knowledge sources
    const [profile, githubRepos, privateReadmes, knowledgeBase] = await Promise.all([
      loadProfile(),
      fetchPublicRepos(),
      loadPrivateReadmes(),
      loadKnowledgeBase(),
    ]);

    // Build system prompt with defensive additions
    let systemPrompt = buildSystemPrompt(profile, githubRepos, privateReadmes, knowledgeBase);
    systemPrompt += '\n\n' + inputSanitization.getDefensivePromptAddition();

    // Get response from DeepSeek
    const response = await chatWithDeepSeek(messages, systemPrompt);

    // Create response with session cookie
    const jsonResponse = NextResponse.json({ message: response });

    jsonResponse.cookies.set('guardian_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return jsonResponse;
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        message: 'ERROR: Unable to process your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}
