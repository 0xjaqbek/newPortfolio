import { NextResponse } from 'next/server';
import { fetchAllRepos } from '@/lib/github/repos';

export const revalidate = 3600; // Revalidate every hour

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
