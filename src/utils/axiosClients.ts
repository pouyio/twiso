import axios, { AxiosRequestConfig } from 'axios';
import { AuthService } from './AuthService';
import { BASE_URL, config, CONTENT_TYPE, TRAKT_API_VERSION } from './apiConfig';

const axiosConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: {
    'content-type': CONTENT_TYPE,
    'trakt-api-key': config.traktApiKey,
    'trakt-api-version': TRAKT_API_VERSION,
  },
};

const authTraktClient = axios.create(axiosConfig);

const traktClient = axios.create(axiosConfig);

authTraktClient.interceptors.request.use(
  (config) => {
    const authService = AuthService.getInstance();
    if (authService.session) {
      config.headers.Authorization = `Bearer ${authService.session.access_token}`;
    } else {
      throw new Error('Cant make request, no access token available');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { traktClient, authTraktClient };
