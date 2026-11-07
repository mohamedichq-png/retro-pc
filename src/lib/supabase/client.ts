// RETRO Qatar — Supabase Client for Client Components (Browser)
// Uses @supabase/ssr createBrowserClient for singleton browser session & cookie management

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqtkwwgxmsnjqwylsopq.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_f-3DLGzU9xi5NpB_eWhnYg_Vbl7Akr7';

  return createBrowserClient(supabaseUrl, supabaseKey);
}

