const tmbdb_api_key = process.env.VITE_TMDB_API_KEY;

export const config = {
  tmdbApiKey: tmbdb_api_key,
};

export * from './apiConsts';
