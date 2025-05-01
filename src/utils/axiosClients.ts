import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL, config, CONTENT_TYPE } from './apiConfig';

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

export { traktClient, authSimklClient, authTraktClient };
