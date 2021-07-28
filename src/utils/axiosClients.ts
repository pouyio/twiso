import axios from 'axios';
import { AuthService } from './AuthService';
import { config, CONTENT_TYPE, TRAKT_API_VERSION } from './apiConfig';
import axiosRateLimit from 'axios-rate-limit';

const authTraktClient = axiosRateLimit(axios.create(), {
  maxRequests: 1000,
  perMilliseconds: 5 * 60 * 1000,
});

const traktClient = axiosRateLimit(axios.create(), {
  maxRequests: 1000,
  perMilliseconds: 5 * 60 * 1000,
});

traktClient.defaults.headers.common['content-type'] = CONTENT_TYPE;
traktClient.defaults.headers.common['trakt-api-key'] = config.traktApiKey;
traktClient.defaults.headers.common['trakt-api-version'] = TRAKT_API_VERSION;

authTraktClient.defaults.headers.common['content-type'] = CONTENT_TYPE;
authTraktClient.defaults.headers.common['trakt-api-key'] = config.traktApiKey;
authTraktClient.defaults.headers.common[
  'trakt-api-version'
] = TRAKT_API_VERSION;

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

export default traktClient;
export { traktClient, authTraktClient };
