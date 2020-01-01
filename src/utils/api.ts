import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { Session } from './AuthContext';
import {
  MovieWatchlist,
  ShowWatchlist,
  Movie,
  Translation,
  ShowProgress,
  Season,
  Episode,
  Show,
  ItemType,
  ImgConfig,
  People,
  Popular,
  Person,
  RemovedWatched,
  AddedWatched,
  AddedWatchlist,
  RemovedWatchlist,
  UserStats,
  ImageResponse,
  ShowWatched,
  MovieWatched,
  Ids,
  Ratings,
} from '../models';

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
  return axios.get<ImgConfig>(
    `${IMG_URL}/configuration?api_key=${tmbdb_api_key}`,
  );
};

export const getImgsApi = (id: number, type: ItemType) => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return limitAxios.get<ImageResponse>(
    `${IMG_URL}/${newType}/${id}/images?api_key=${tmbdb_api_key}`,
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
    `${BASE_URL}/shows/${id}/seasons?translations=es`,
    {
      headers: base_headers,
    },
  );
};

export const getSeasonEpisodesApi = (id: number, season: number) => {
  return axios.get<Episode[]>(
    `${BASE_URL}/shows/${id}/seasons/${season}?extended=full&translations=es`,
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
  return axios.get<Translation[]>(
    `${BASE_URL}/${type}s/${id}/translations/es`,
    {
      headers: base_headers,
    },
  );
};

export const searchApi = <T>(
  query: string,
  type: string,
  limit: number = 40,
) => {
  return axios.get<T[]>(
    `${BASE_URL}/search/${type}?query=${query}&extended=full&page=1&limit=${limit}`,
    {
      headers: base_headers,
    },
  );
};

export const getWatchedApi = <T extends MovieWatched | ShowWatched>(
  session: Session,
  type: ItemType,
) => {
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
  return axios.post<AddedWatched>(
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
  return axios.post<RemovedWatched>(
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
  type: 'movie' | 'show',
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
  return axios.post<AddedWatchlist>(
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
  return axios.post<RemovedWatchlist>(
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
  return axios.get<People>(`${BASE_URL}/${type}s/${id}/people`, {
    headers: {
      ...base_headers,
    },
  });
};

export const getPersonApi = (id: number) => {
  return axios.get<Person>(`${BASE_URL}/people/${id}?extended=full`, {
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

export const getPopularApi = (type: ItemType, limit: number = 40) => {
  const year = new Date().getFullYear();
  return axios.get<Popular[]>(
    `${BASE_URL}/${type}s/watched/weekly?extended=full&page=1&limit=${limit}&years=${year}`,
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

export const getStatsApi = (session: Session) => {
  return axios.get<UserStats>(`${BASE_URL}/users/me/stats`, {
    headers: {
      ...base_headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  });
};

export const getRatingsApi = (id: Ids, type: ItemType) => {
  return axios.get<Ratings>(`${BASE_URL}/${type}s/${id}/ratings`, {
    headers: {
      ...base_headers,
    },
  });
};
