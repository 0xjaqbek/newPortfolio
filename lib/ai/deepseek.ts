interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatWithDeepSeek(
  messages: Message[],
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  const baseUrl = process.env.AI_PROVIDER_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.AI_PROVIDER_MODEL || 'deepseek-chat';

  if (!apiKey) {
    throw new Error('AI_PROVIDER_API_KEY is not configured');
  }

  const payload = {
    model,
    messages: systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages,
    temperature: 0.7,
    max_tokens: 2000,
  };

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data: DeepSeekResponse = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from DeepSeek');
    }

    return assistantMessage;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
}
