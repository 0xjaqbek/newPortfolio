import { NextRequest, NextResponse } from 'next/server';
import { fetchRepoReadme } from '@/lib/github/repos';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'Missing owner or repo parameter' },
      { status: 400 }
    );
  }

  try {
    const readme = await fetchRepoReadme(owner, repo);
    if (!readme) {
      return NextResponse.json(
        { error: 'README not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ readme });
  } catch (error) {
    console.error('GitHub README API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch README' },
      { status: 500 }
    );
  }
}
