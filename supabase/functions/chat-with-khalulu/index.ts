
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    // Get user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('Auth error:', userError);
      throw new Error('Authentication failed');
    }
    
    if (!user) {
      console.error('No user found');
      throw new Error('User not authenticated');
    }

    console.log('User authenticated:', user.email);

    let currentConversationId = conversationId;

    // Create new conversation if none exists
    if (!currentConversationId) {
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
    }

    // Save user message
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

    // Get conversation history
    const { data: messages, error: historyError } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('History fetch error:', historyError);
      throw historyError;
    }

    // Prepare messages for OpenAI
    const openAIMessages = [
      {
        role: 'system',
        content: `You are Khalulu, a wise and friendly owl who serves as a learning companion. You are chatty, encouraging, and love to help with educational topics. Your personality is warm, patient, and slightly playful. You often use gentle encouragement and relate things back to learning and growth. You should be conversational and remember the context of your chats. Keep responses engaging but not too long. You can provide current information like time zones when asked, but focus on being educational and supportive.`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log('Calling OpenAI with messages:', openAIMessages.length);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAIMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openAIData = await openAIResponse.json();
    const aiResponse = openAIData.choices[0].message.content;

    console.log('OpenAI response received');

    // Save AI response
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
