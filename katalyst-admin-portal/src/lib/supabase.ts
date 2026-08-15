import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') && 
    !supabaseAnonKey.includes('your-') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

let client: SupabaseClient;
try {
  client = createClient(
    isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
    isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
} catch (e) {
  console.warn('Supabase client initialization failed, using dummy fallback:', e);
  client = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
}

export const supabase = client;
