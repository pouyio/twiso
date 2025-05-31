const trakt_api_key = process.env.VITE_TRAKT_API_KEY;
const tmbdb_api_key = process.env.VITE_TMDB_API_KEY;

export const config = {
  traktApiKey: trakt_api_key,
  tmdbApiKey: tmbdb_api_key,
};

export * from './apiConsts';
