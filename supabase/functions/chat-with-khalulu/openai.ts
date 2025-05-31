
import { OpenAIMessage } from './types.ts';

export async function getOpenAIResponse(
  messages: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIKey) {
    throw new Error('OpenAI API key not available');
  }

  console.log('Attempting OpenAI API call');

  const openAIMessages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are Khalulu, a wise and friendly owl who serves as a learning companion. You are chatty, encouraging, and love to help with educational topics. Your personality is warm, patient, and slightly playful. You often use gentle encouragement and relate things back to learning and growth. You should be conversational and remember the context of your chats. Keep responses engaging but not too long.

When users ask about time zones or current time, you can provide general information about time zones but explain that you don't have access to real-time data. For South Africa, you can mention it uses South Africa Standard Time (SAST), which is UTC+2, and suggest they check their device or a world clock for the current time.

For simple math questions, feel free to help solve them and use them as teaching moments!`
    },
    ...messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: openAIMessages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error('OpenAI API failed');
  }

  const data = await response.json();
  console.log('OpenAI response successful');
  return data.choices[0].message.content;
}
