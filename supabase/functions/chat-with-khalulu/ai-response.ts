
import { getOpenAIResponse } from './openai.ts';
import { getHuggingFaceResponse } from './huggingface.ts';
import { getFallbackResponse } from './fallbacks.ts';

export async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string> {
  try {
    return await getOpenAIResponse(messages, userMessage);
  } catch (openAIError) {
    console.error('OpenAI request failed, falling back to Hugging Face:', openAIError);
    
    try {
      const hfResponse = await getHuggingFaceResponse(userMessage);
      console.log('Hugging Face response successful');
      return hfResponse;
    } catch (hfError) {
      console.error('Hugging Face request failed:', hfError);
      return getFallbackResponse(userMessage);
    }
  }
}
