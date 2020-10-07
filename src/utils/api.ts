import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import {
  AddedWatched,
  AddedWatchlist,
  Episode,
  ImageResponse,
  ImgConfig,
  ItemType,
  Movie,
  MovieCalendar,
  MovieWatched,
  MovieWatchlist,
  People,
  Person,
  Popular,
  Profile,
  Ratings,
  RemovedWatched,
  RemovedWatchlist,
  Season,
  Show,
  ShowCalendar,
  ShowProgress,
  ShowWatched,
  ShowWatchlist,
  Translation,
  UserStats,
} from '../models';
import { BASE_URL, config, IMG_URL, LOGIN_URL } from './apiConfig';
import traktClient from './axiosClients';
import { Session } from './AuthService';

const limitClient = rateLimit(axios.create(), {
  maxRequests: 42,
  perMilliseconds: 10000,
});

export const loginApi = (code: string) => {
  return axios.post<Session>(LOGIN_URL, {
    code,
    client_id: config.traktApiKey,
    redirect_uri: config.redirectUrl,
    grant_type: 'authorization_code',
  });
};

export const refreshApi = (refreshToken: string) => {
  return axios.post<Session>(LOGIN_URL, {
    refresh_token: refreshToken,
    client_id: config.traktApiKey,
    redirect_uri: config.redirectUrl,
    grant_type: 'refresh_token',
  });
};

export const getImgsConfigApi = () => {
  return axios.get<ImgConfig>(
    `${IMG_URL}/configuration?api_key=${config.tmdbApiKey}`
  );
};

export const getImgsApi = (id: number, type: ItemType) => {
  let newType: string = type;
  if (type === 'show') {
    newType = 'tv';
  }
  return limitClient.get<ImageResponse>(
    `${IMG_URL}/${newType}/${id}/images?api_key=${config.tmdbApiKey}`
  );
};

export const getApi = <T>(id: number, type: ItemType) => {
  return traktClient.get<T[]>(
    `${BASE_URL}/search/trakt/${id}?type=${type}&extended=full`
  );
};

export const getSeasonsApi = (id: number) => {
  return traktClient.get<Season[]>(
    `${BASE_URL}/shows/${id}/seasons?translations=es`
  );
};

export const getSeasonEpisodesApi = (id: number, season: number) => {
  return traktClient.get<Episode[]>(
    `${BASE_URL}/shows/${id}/seasons/${season}?extended=full&translations=es`
  );
};

export const getProgressApi = (id: number) => {
  return traktClient.get<ShowProgress>(
    `${BASE_URL}/shows/${id}/progress/watched?specials=true&count_specials=false`,
    {
      headers: {
        Authorization: true,
      },
    }
  );
};

export const getTranslationsApi = (id: number, type: ItemType) => {
  return traktClient.get<Translation[]>(
    `${BASE_URL}/${type}s/${id}/translations/es`
  );
};

export const searchApi = <T>(
  query: string,
  type: string,
  limit: number = 40
) => {
  return traktClient.get<T[]>(
    `${BASE_URL}/search/${type}?query=${query}&extended=full&page=1&limit=${limit}`
  );
};

export const getWatchedApi = <T extends MovieWatched | ShowWatched>(
  type: ItemType
) => {
  const url =
    type === 'movie'
      ? `${BASE_URL}/sync/history/movies?page=1&limit=10000&extended=full`
      : `${BASE_URL}/sync/watched/shows?extended=full`;

  return traktClient.get<T[]>(url, {
    headers: {
      Authorization: true,
    },
  });
};

export const addWatchedApi = (
  item: Episode | Season | Movie,
  type: ItemType
) => {
  return traktClient.post<AddedWatched>(
    `${BASE_URL}/sync/history`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        Authorization: true,
      },
    }
  );
};

export const removeWatchedApi = (
  item: Episode | Season | Movie,
  type: ItemType
) => {
  return traktClient.post<RemovedWatched>(
    `${BASE_URL}/sync/history/remove`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        Authorization: true,
      },
    }
  );
};

export const getWatchlistApi = <T extends MovieWatchlist | ShowWatchlist>(
  type: 'movie' | 'show'
) => {
  return traktClient
    .get<T[]>(`${BASE_URL}/sync/watchlist/${type}s?extended=full`, {
      headers: {
        Authorization: true,
      },
    })
    .then((res) => {
      const ordered = res.data.sort(
        (a, b) =>
          (new Date(b.listed_at as string) as any) -
          (new Date(a.listed_at as string) as any)
      );
      res.data = ordered;
      return res;
    });
};

export const addWatchlistApi = (item: Show | Movie, type: ItemType) => {
  return traktClient.post<AddedWatchlist>(
    `${BASE_URL}/sync/watchlist`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        Authorization: true,
      },
    }
  );
};

export const removeWatchlistApi = (item: Show | Movie, type: ItemType) => {
  return traktClient.post<RemovedWatchlist>(
    `${BASE_URL}/sync/watchlist/remove`,
    {
      [`${type}s`]: [item],
    },
    {
      headers: {
        Authorization: true,
      },
    }
  );
};

export const getPeopleApi = (id: number, type: ItemType) => {
  return traktClient.get<People>(`${BASE_URL}/${type}s/${id}/people`);
};

export const getPersonApi = (id: number) => {
  return traktClient.get<Person>(`${BASE_URL}/people/${id}?extended=full`);
};

export const getPersonItemsApi = <T>(person: string, type: ItemType) => {
  return traktClient.get<T>(
    `${BASE_URL}/people/${person}/${type}s?extended=full`
  );
};

export const getPopularApi = (type: ItemType, limit: number = 40) => {
  const year = new Date().getFullYear();
  return traktClient.get<Popular[]>(
    `${BASE_URL}/${type}s/watched/weekly?extended=full&page=1&limit=${limit}&years=${year}`
  );
};

export const getRelatedApi = <T>(id: number, type: ItemType) => {
  return traktClient.get<T[]>(
    `${BASE_URL}/${type}s/${id}/related?extended=full&page=1&limit=12`
  );
};

export const getStatsApi = () => {
  return traktClient.get<UserStats>(`${BASE_URL}/users/me/stats`, {
    headers: {
      Authorization: true,
    },
  });
};

export const getProfileApi = () => {
  return traktClient.get<Profile>(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: true,
    },
  });
};

export const getRatingsApi = (id: number, type: ItemType) => {
  return traktClient.get<Ratings>(`${BASE_URL}/${type}s/${id}/ratings`);
};

export const getCalendar = <T extends MovieCalendar | ShowCalendar>(
  type: ItemType,
  firstDaxios: string,
  period: number
) => {
  return traktClient.get<T[]>(
    `${BASE_URL}/calendars/my/${type}s/${firstDaxios}/${period}`,
    {
      headers: {
        Authorization: true,
      },
    }
  );
};
