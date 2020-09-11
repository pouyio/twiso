import axios from 'axios';
import { AuthService } from './AuthService';
import { config, CONTENT_TYPE, TRAKT_API_VERSION } from './apiConfig';

const traktClient = axios.create();

traktClient.defaults.headers.common['content-type'] = CONTENT_TYPE;
traktClient.defaults.headers.common['trakt-api-key'] = config.traktApiKey;
traktClient.defaults.headers.common['trakt-api-version'] = TRAKT_API_VERSION;

traktClient.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      const authService = AuthService.getInstance();
      if (authService.session) {
        config.headers.Authorization = `Bearer ${authService.session.access_token}`;
      } else {
        throw new Error('Cant make request, no access token available');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default traktClient;
