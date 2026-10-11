import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://${process.env.VITE_SUPABASE_DB ?? ''}.supabase.co`;
const functionsUrl = process.env.VITE_SUPABASE_FUNCTIONS_URL?.replace(
  /\/$/,
  ''
);

const fetchFn: typeof fetch = (input, init) => {
  if (functionsUrl) {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const marker = '/functions/v1/';
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      input = `${functionsUrl}/${url.slice(idx + marker.length)}`;
    }
  }
  return fetch(input, init);
};

export const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY ?? '', {
  global: { fetch: functionsUrl ? fetchFn : undefined },
});
