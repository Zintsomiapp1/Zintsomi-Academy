
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
const HF_API_TOKEN = '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';

export async function getHuggingFaceResponse(message: string): Promise<string> {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        inputs: message,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Hugging Face raw response:', data);

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.replace(message, '').trim() || "I'm here to help with your learning journey!";
    } else if (data.generated_text) {
      return data.generated_text.replace(message, '').trim() || "I'm here to help with your learning journey!";
    } else {
      throw new Error('Unexpected Hugging Face API response format');
    }
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
}
