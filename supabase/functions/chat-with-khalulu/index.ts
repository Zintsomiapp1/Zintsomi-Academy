
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from './cors.ts';
import { authenticateUser } from './auth.ts';
import { ensureConversation, saveMessage, getConversationHistory } from './conversation.ts';
import { generateAIResponse } from './ai-response.ts';
import { ChatRequest, ChatResponse } from './types.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { message, conversationId }: ChatRequest = await req.json();
    console.log('Received message:', message);
    console.log('Conversation ID:', conversationId);
    
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header:', authHeader ? 'present' : 'missing');
    
    const { user, supabaseClient } = await authenticateUser(authHeader);

    const currentConversationId = await ensureConversation(
      supabaseClient, 
      conversationId || null, 
      user.id
    );

    console.log('Saving user message to conversation:', currentConversationId);
    await saveMessage(supabaseClient, currentConversationId, 'user', message);

    const messages = await getConversationHistory(supabaseClient, currentConversationId);

    const aiResponse = await generateAIResponse(messages, message);

    console.log('Saving AI response to conversation');
    await saveMessage(supabaseClient, currentConversationId, 'assistant', aiResponse);

    console.log('Successfully completed chat interaction');

    const response: ChatResponse = { 
      response: aiResponse, 
      conversationId: currentConversationId 
    };

    return new Response(JSON.stringify(response), {
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
