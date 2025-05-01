const trakt_api_key = process.env.VITE_TRAKT_API_KEY;
const simkl_client_id = process.env.VITE_SIMKL_CLIENT_ID;
const simkl_client_secret = process.env.VITE_SIMKL_CLIENT_SECRET;
const tmbdb_api_key = process.env.VITE_TMDB_API_KEY;
const redirect_url = process.env.VITE_REDIRECT_URL;

// TODO remove unused trakt
export const config = {
  traktApiKey: trakt_api_key,
  tmdbApiKey: tmbdb_api_key,
  simklClientId: simkl_client_id,
  simklClientSecret: simkl_client_secret,
  redirectUrl: redirect_url,
};

export * from './apiConsts';
