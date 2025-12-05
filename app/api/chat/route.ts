import { NextRequest, NextResponse } from 'next/server';
import { chatWithDeepSeek } from '@/lib/ai/deepseek';
import { buildSystemPrompt } from '@/lib/ai/systemPrompt';
import { loadProfile, loadKnowledgeBase, loadPrivateReadmes } from '@/lib/knowledge/profile';
import { fetchPublicRepos } from '@/lib/github/repos';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Load all knowledge sources
    const [profile, githubRepos, privateReadmes, knowledgeBase] = await Promise.all([
      loadProfile(),
      fetchPublicRepos(),
      loadPrivateReadmes(),
      loadKnowledgeBase(),
    ]);

    // Build system prompt with all knowledge
    const systemPrompt = buildSystemPrompt(profile, githubRepos, privateReadmes, knowledgeBase);

    // Get response from DeepSeek
    const response = await chatWithDeepSeek(messages, systemPrompt);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        message:
          'ERROR: Unable to process your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}
