import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/admin-auth';
import prisma from '@/lib/db/prisma';

/**
 * Get all suspensions
 */
export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const suspensions = await prisma.sessionSuspension.findMany({
      where: { isActive: true },
      include: { session: true },
      orderBy: { suspendedAt: 'desc' },
    });

    return NextResponse.json({ suspensions });
  } catch (error) {
    console.error('Suspensions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch suspensions' }, { status: 500 });
  }
}

/**
 * Lift suspension
 */
export async function DELETE(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await prisma.sessionSuspension.update({
      where: { sessionId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lift suspension error:', error);
    return NextResponse.json({ error: 'Failed to lift suspension' }, { status: 500 });
  }
}
