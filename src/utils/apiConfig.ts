const trakt_api_key = process.env.VITE_TRAKT_API_KEY;
const tmbdb_api_key = process.env.VITE_TMDB_API_KEY;
const redirect_url = process.env.VITE_REDIRECT_URL;

export const CONTENT_TYPE = 'application/json';
export const TRAKT_API_VERSION = 2;
export const BASE_URL = 'https://api.trakt.tv';
export const LOGIN_URL = 'https://trakt.tv/oauth/token';
export const IMG_URL = 'https://api.themoviedb.org/3';

export const config = {
  traktApiKey: trakt_api_key,
  tmdbApiKey: tmbdb_api_key,
  redirectUrl: redirect_url,
};
