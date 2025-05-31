import axios from 'axios';
import {
  BASE_TRAKT_URL,
  config,
  CONTENT_TYPE,
  TRAKT_API_VERSION,
} from './apiConfig';

const traktClient = axios.create({
  baseURL: BASE_TRAKT_URL,
  headers: {
    'content-type': CONTENT_TYPE,
    'trakt-api-key': config.traktApiKey,
    'trakt-api-version': TRAKT_API_VERSION,
  },
});

export { traktClient };
