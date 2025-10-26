import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  `https://${process.env.VITE_SUPABASE_DB ?? ''}.supabase.co`,
  process.env.VITE_SUPABASE_ANON_KEY ?? ''
);
