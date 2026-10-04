import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Admin client — uses service role key, bypasses RLS.
// ONLY use this on the backend; never expose service role key to the frontend.
export const supabaseAdmin = env.hasSupabase
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Lightweight helper to validate user JWTs from the Authorization header.
// We use the admin client's auth.getUser() which calls Supabase auth server.
export async function verifySupabaseToken(token: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    throw new Error(error?.message ?? 'Invalid token');
  }
  return data.user;
}
