import axios, { AxiosRequestConfig } from 'axios';
import {
  BASE_TRAKT_URL,
  BASE_URL,
  config,
  CONTENT_TYPE,
  TRAKT_API_VERSION,
} from './apiConfig';

const axiosConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: {
    'content-type': CONTENT_TYPE,
    'simkl-api-key': config.simklClientId,
  },
};

// TODO remove trakt
const authTraktClient = axios.create(axiosConfig);
const authSimklClient = axios.create(axiosConfig);
const traktClient = axios.create(axiosConfig);
const traktClientOld = axios.create({
  baseURL: BASE_TRAKT_URL,
  headers: {
    'content-type': CONTENT_TYPE,
    'trakt-api-key': config.traktApiKey,
    'trakt-api-version': TRAKT_API_VERSION,
  },
});

authSimklClient.interceptors.request.use(
  (config) => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      throw new Error('Cant make request, no access token available');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { traktClient, authSimklClient, authTraktClient, traktClientOld };
