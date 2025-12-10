import { NextResponse } from 'next/server';
import { fetchAllRepos } from '@/lib/github/repos';

export const revalidate = 60; // Revalidate every minute (was 3600)
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET() {
  try {
    const repos = await fetchAllRepos();
    return NextResponse.json({ repos });
  } catch (error) {
    console.error('GitHub repos API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
