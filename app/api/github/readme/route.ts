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
        { readme: `# ${repo}\n\nREADME not available for this repository.` }
      );
    }
    return NextResponse.json({ readme });
  } catch (error: any) {
    console.error('GitHub README API error:', error);
    // Return a friendly error message instead of failing
    return NextResponse.json({
      readme: `# ${repo}\n\nUnable to load README. This may be a private repository or the README may not be accessible.\n\nError: ${error?.message || 'Unknown error'}`
    });
  }
}
