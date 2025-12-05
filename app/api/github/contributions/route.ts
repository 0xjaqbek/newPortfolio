import { NextResponse } from 'next/server';
import { fetchContributionStats } from '@/lib/github/contributions';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const stats = await fetchContributionStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub contributions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contribution stats' },
      { status: 500 }
    );
  }
}
