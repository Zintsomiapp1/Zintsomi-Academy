
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export async function ensureConversation(
  supabaseClient: SupabaseClient,
  conversationId: string | null,
  userId: string
): Promise<string> {
  if (conversationId) {
    return conversationId;
  }

  console.log('Creating new conversation for user:', userId);
  const { data: newConversation, error: convError } = await supabaseClient
    .from('chat_conversations')
    .insert([{
      user_id: userId,
      title: 'Chat with Khalulu'
    }])
    .select()
    .single();

  if (convError) {
    console.error('Conversation creation error:', convError);
    throw convError;
  }
  
  console.log('Created conversation:', newConversation.id);
  return newConversation.id;
}

export async function saveMessage(
  supabaseClient: SupabaseClient,
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
) {
  const { error } = await supabaseClient
    .from('chat_messages')
    .insert([{
      conversation_id: conversationId,
      role: role,
      content: content
    }]);

  if (error) {
    console.error(`${role} message save error:`, error);
    throw error;
  }
}

export async function getConversationHistory(
  supabaseClient: SupabaseClient,
  conversationId: string
) {
  const { data: messages, error: historyError } = await supabaseClient
    .from('chat_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(10);

  if (historyError) {
    console.error('History fetch error:', historyError);
    throw historyError;
  }

  console.log('Retrieved message history, count:', messages?.length || 0);
  return messages || [];
}
