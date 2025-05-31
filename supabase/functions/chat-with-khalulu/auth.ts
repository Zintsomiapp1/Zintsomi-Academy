
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export async function authenticateUser(authHeader: string | null) {
  if (!authHeader) {
    console.error('No authorization header found');
    throw new Error('Authorization header missing');
  }

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

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError || !user) {
    console.error('User verification error:', userError);
    throw new Error(`Authentication failed: ${userError?.message || 'Invalid token'}`);
  }
  
  console.log('User authenticated:', user.email);
  return { user, supabaseClient };
}
