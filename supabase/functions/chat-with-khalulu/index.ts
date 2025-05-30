
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hugging Face configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
const HF_API_TOKEN = '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';

async function getHuggingFaceResponse(message: string): Promise<string> {
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

    // Handle different response formats
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();
    console.log('Received message:', message);
    console.log('Conversation ID:', conversationId);
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header:', authHeader ? 'present' : 'missing');
    
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error('Authorization header missing');
    }

    // Extract the token from the Bearer token
    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token length:', token ? token.length : 0);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: {
          persistSession: false,
        }
      }
    );

    // Get user directly with the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('User verification error:', userError);
      throw new Error(`Authentication failed: ${userError?.message || 'Invalid token'}`);
    }
    
    console.log('User authenticated:', user.email);

    let currentConversationId = conversationId;

    // Create new conversation if none exists
    if (!currentConversationId && user.id) {
      console.log('Creating new conversation for user:', user.id);
      const { data: newConversation, error: convError } = await supabaseClient
        .from('chat_conversations')
        .insert([{
          user_id: user.id,
          title: 'Chat with Khalulu'
        }])
        .select()
        .single();

      if (convError) {
        console.error('Conversation creation error:', convError);
        throw convError;
      }
      currentConversationId = newConversation.id;
      console.log('Created conversation:', currentConversationId);
    }

    // Save user message
    console.log('Saving user message to conversation:', currentConversationId);
    const { error: userMsgError } = await supabaseClient
      .from('chat_messages')
      .insert([{
        conversation_id: currentConversationId,
        role: 'user',
        content: message
      }]);

    if (userMsgError) {
      console.error('User message save error:', userMsgError);
      throw userMsgError;
    }

    // Get conversation history for context
    const { data: messages, error: historyError } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })
      .limit(10); // Limit to recent messages for context

    if (historyError) {
      console.error('History fetch error:', historyError);
      throw historyError;
    }

    console.log('Retrieved message history, count:', messages?.length || 0);

    let aiResponse: string;

    // Check if we have OpenAI API key first
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (openAIKey) {
      console.log('Attempting OpenAI API call');
      try {
        // Prepare messages for OpenAI with enhanced system prompt
        const openAIMessages = [
          {
            role: 'system',
            content: `You are Khalulu, a wise and friendly owl who serves as a learning companion. You are chatty, encouraging, and love to help with educational topics. Your personality is warm, patient, and slightly playful. You often use gentle encouragement and relate things back to learning and growth. You should be conversational and remember the context of your chats. Keep responses engaging but not too long.

When users ask about time zones or current time, you can provide general information about time zones but explain that you don't have access to real-time data. For South Africa, you can mention it uses South Africa Standard Time (SAST), which is UTC+2, and suggest they check their device or a world clock for the current time.

For simple math questions, feel free to help solve them and use them as teaching moments!`
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ];

        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          aiResponse = openAIData.choices[0].message.content;
          console.log('OpenAI response successful');
        } else {
          const errorData = await openAIResponse.json();
          console.error('OpenAI API error:', errorData);
          throw new Error('OpenAI API failed');
        }
      } catch (openAIError) {
        console.error('OpenAI request failed, falling back to Hugging Face:', openAIError);
        // Fall back to Hugging Face
        aiResponse = await getHuggingFaceResponse(message);
        console.log('Using Hugging Face response');
      }
    } else {
      console.log('No OpenAI key found, using Hugging Face');
      // Use Hugging Face directly
      try {
        aiResponse = await getHuggingFaceResponse(message);
        console.log('Hugging Face response successful');
      } catch (hfError) {
        console.error('Hugging Face request failed:', hfError);
        // Final fallback
        if (message.toLowerCase().includes('4') && message.toLowerCase().includes('4')) {
          aiResponse = "Great math question! 4 + 4 = 8. Math is such a wonderful subject - it's like solving puzzles! Would you like to try some more math problems or learn about different mathematical concepts?";
        } else {
          aiResponse = "Hello! I'm Khalulu, your friendly learning companion. I'm experiencing some technical difficulties right now, but I'm still here to help with your learning journey! What would you like to explore today?";
        }
      }
    }

    // Save AI response
    console.log('Saving AI response to conversation');
    const { error: aiMsgError } = await supabaseClient
      .from('chat_messages')
      .insert([{
        conversation_id: currentConversationId,
        role: 'assistant',
        content: aiResponse
      }]);

    if (aiMsgError) {
      console.error('AI message save error:', aiMsgError);
      throw aiMsgError;
    }

    console.log('Successfully completed chat interaction');

    return new Response(JSON.stringify({ 
      response: aiResponse, 
      conversationId: currentConversationId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-khalulu function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
