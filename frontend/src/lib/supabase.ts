import { createClient } from '@supabase/supabase-js';

// Only services/supabase/* should import this.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? 'http://localhost:54321',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'mock-anon-key',
);
