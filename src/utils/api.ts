import axios from 'axios';
import { PAGE_SIZE } from './UserContext';
import rateLimit from 'axios-rate-limit';
import { ItemType } from '../models/ItemType';
import { Session } from './AuthContext';
import {
  SearchMovie,
  SearchPerson,
  SearchShow,
  MovieWatchlist,
  ShowWatchlist,
  Movie,
} from '../models/Movie';
import { ShowProgress, Season, Episode, Show } from '../models/Show';
import { IImgConfig } from '../models/IImgConfig';
import { IPeople } from '../models/IPeople';
import { IPopular } from '../models/IPopular';
import { IPerson } from '../models/IPerson';

const trakt_api_key = process.env.REACT_APP_TRAKT_API_KEY;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const tmbdb_api_key = process.env.REACT_APP_TMDB_API_KEY;
const redirect_url = process.env.REACT_APP_REDIRECT_URL;
const content_type = 'application/json';
const trakt_api_version = 2;
const BASE_URL = 'https://api.trakt.tv';
const LOGIN_URL = 'https://trakt.tv/oauth/token';
const IMG_URL = 'https://api.themoviedb.org/3';

const base_headers = {
  'content-type': content_type,
  'trakt-api-key': trakt_api_key,
  'trakt-api-version': trakt_api_version,
};

const limitAxios = rateLimit(axios.create(), {
  maxRequests: 42,
  perMilliseconds: 10000,
});

export const loginApi = (code: string) => {
  return axios.post<Session>(LOGIN_URL, {
    code,
    client_secret,
    client_id: trakt_api_key,
    redirect_uri: redirect_url,
    grant_type: 'authorization_code',
  });
};

export const getImgsConfigApi = () => {
  return axios.get<IImgConfig>(
    `${IMG_URL}/configuration?api_key=${tmbdb_api_key}`,
  );
};

export const getImgsApi = (id: number, type: ItemType): Promise<string> => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return limitAxios.get(
    `${IMG_URL}/${newType}/${id}/images?api_key=${tmbdb_api_key}&include_image_language=es,en`,
  );
};

export const getApi = <T>(id: number, type: ItemType) => {
  return axios.get<T[]>(
    `${BASE_URL}/search/trakt/${id}?type=${type}&extended=full`,
    {
      headers: base_headers,
    },
  );
};

export const getSeasonsApi = (id: number) => {
  return axios.get<Season[]>(
    `${BASE_URL}/shows/${id}/seasons?extended=episodes&translations=es`,
    {
      headers: base_headers,
    },
  );
};

export const getProgressApi = (session: Session, id: number) => {
  return axios.get<ShowProgress>(
    `${BASE_URL}/shows/${id}/progress/watched?specials=true&count_specials=false`,
    {
      headers: {
        ...base_headers,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );
};

export const getTranslationsApi = (id: number, type: ItemType) => {
  return axios.get(`${BASE_URL}/${type}s/${id}/translations/es`, {
    headers: base_headers,
  });
};

export const searchApi = (query: string, type: string) => {
  return axios.get<(SearchMovie & SearchShow & SearchPerson)[]>(
    `${BASE_URL}/search/${type}?query=${query}&extended=full&page=1&limit=${PAGE_SIZE}`,
    {
      headers: base_headers,
    },
  );
};

export const getWatchedApi = <T>(session: Session, type: ItemType) => {
  const url =
    type === 'movie'
      ? `${BASE_URL}/sync/history/movies?page=1&limit=10000&extended=full`
      : `${BASE_URL}/sync/watched/shows?extended=full`;

  return axios.get<T[]>(url, {
    headers: {
      ...base_headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  });
};

export const addWatchedApi = (
  item: Episode | Season | Movie,
  session: Session,
  type: ItemType,
) => {
  return axios.post(
    `${BASE_URL}/sync/history`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        ...base_headers,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );
};

export const removeWatchedApi = (
  item: Episode | Season | Movie,
  session: Session,
  type: ItemType,
) => {
  return axios.post(
    `${BASE_URL}/sync/history/remove`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        ...base_headers,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );
};

export const getWatchlistApi = <T extends MovieWatchlist | ShowWatchlist>(
  session: Session,
  type: ItemType,
) => {
  return axios
    .get<T[]>(`${BASE_URL}/sync/watchlist/${type}s?extended=full`, {
      headers: {
        ...base_headers,
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    .then(res => {
      const ordered = res.data.sort(
        (a, b) =>
          (new Date(b.listed_at as string) as any) -
          (new Date(a.listed_at as string) as any),
      );
      res.data = ordered;
      return res;
    });
};

export const addWatchlistApi = (
  item: Show | Movie,
  session: Session,
  type: ItemType,
) => {
  return axios.post(
    `${BASE_URL}/sync/watchlist`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        ...base_headers,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );
};

export const removeWatchlistApi = (
  item: Show | Movie,
  session: Session,
  type: ItemType,
) => {
  return axios.post(
    `${BASE_URL}/sync/watchlist/remove`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        ...base_headers,
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );
};

export const getPeopleApi = (id: number, type: ItemType) => {
  return axios.get<IPeople>(`${BASE_URL}/${type}s/${id}/people`, {
    headers: {
      ...base_headers,
    },
  });
};

export const getPersonApi = (id: number) => {
  return axios.get<IPerson>(`${BASE_URL}/people/${id}?extended=full`, {
    headers: {
      ...base_headers,
    },
  });
};

export const getPersonItemsApi = <T>(person: string, type: ItemType) => {
  return axios.get<T>(`${BASE_URL}/people/${person}/${type}s?extended=full`, {
    headers: {
      ...base_headers,
    },
  });
};

export const getPopularApi = (type: ItemType) => {
  const year = new Date().getFullYear();
  return axios.get<IPopular[]>(
    `${BASE_URL}/${type}s/watched/weekly?extended=full&page=1&limit=${PAGE_SIZE}&years=${year}`,
    {
      headers: {
        ...base_headers,
      },
    },
  );
};

export const getRelatedApi = <T>(id: number, type: ItemType) => {
  return axios.get<T[]>(
    `${BASE_URL}/${type}s/${id}/related?extended=full&page=1&limit=10`,
    {
      headers: {
        ...base_headers,
      },
    },
  );
};

export const getStatsApi = (username: string) => {
  return axios.get(`${BASE_URL}/users/${username}/stats`, {
    headers: {
      ...base_headers,
    },
  });
};
