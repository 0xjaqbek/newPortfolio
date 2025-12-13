import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/admin-auth';
import prisma from '@/lib/db/prisma';

/**
 * Get all IP blocks
 */
export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blocks = await prisma.ipBlock.findMany({
      where: { isActive: true },
      orderBy: { blockedAt: 'desc' },
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('IP blocks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch IP blocks' }, { status: 500 });
  }
}

/**
 * Block IP
 */
export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ipAddress, reason, durationHours, permanent } = await request.json();

    if (!ipAddress || !reason) {
      return NextResponse.json({ error: 'IP address and reason required' }, { status: 400 });
    }

    const expiresAt = permanent ? null : new Date(Date.now() + (durationHours || 24) * 60 * 60 * 1000);

    await prisma.ipBlock.create({
      data: {
        ipAddress,
        reason,
        expiresAt,
        isPermanent: permanent || false,
        blockedBy: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Block IP error:', error);
    return NextResponse.json({ error: 'Failed to block IP' }, { status: 500 });
  }
}

/**
 * Unblock IP
 */
export async function DELETE(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ipAddress } = await request.json();

    if (!ipAddress) {
      return NextResponse.json({ error: 'IP address required' }, { status: 400 });
    }

    await prisma.ipBlock.update({
      where: { ipAddress },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unblock IP error:', error);
    return NextResponse.json({ error: 'Failed to unblock IP' }, { status: 500 });
  }
}
