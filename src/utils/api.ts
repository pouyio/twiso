import { mockData } from './MOCK_DATA';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { config, IMG_URL, LOGIN_URL } from './apiConfig';
import {
  authSimklClient,
  authTraktClient,
  traktClient,
  traktClientOld,
} from './axiosClients';
import Bottleneck from 'bottleneck';
import { getTranslation } from './getTranslations';
import { Language } from 'state/slices/config';
import { Session } from 'contexts/AuthContext';
import { ImgConfig } from '../models/ImgConfig';
import { ItemType } from '../models/ItemType';
import { ImageResponse } from '../models/Image';
import {
  Episode,
  Season,
  Show,
  ShowProgress,
  ShowWatched,
  ShowWatchlist,
} from '../models/Show';
import { Translation } from '../models/Translation';
import {
  Movie,
  MovieWatched,
  MovieWatchlist,
  SearchMovie,
  SearchShow,
} from '../models/Movie';
import {
  Activities,
  AddedHidden,
  AddedWatched,
  AddedWatchlist,
  HiddenShow,
  MovieCalendar,
  Profile,
  Ratings,
  RemovedWatched,
  RemovedWatchlist,
  RemoveHidden,
  ShowCalendar,
  UserStats,
} from '../models/Api';
import { People } from '../models/People';
import { Person } from '../models/Person';
import { Popular } from '../models/Popular';

const limiter = new Bottleneck({
  reservoir: 800,
  reservoirRefreshAmount: 800,
  reservoirRefreshInterval: 5 * 60 * 1000,
  minTime: 50,
  maxConcurrent: 100,
});

const limitClient = rateLimit(axios.create(), {
  maxRequests: 42,
  perMilliseconds: 10000,
});

export const loginApi = (code: string) => {
  return axios.post<Session>(LOGIN_URL, {
    code,
    client_id: config.simklClientId,
    client_secret: config.simklClientSecret,
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

export const getApi = <T extends SearchMovie | SearchShow>(id: string) =>
  limiter.wrap(() =>
    // traktClient.get<T[]>(`/search/trakt/${id}?type=${type}&extended=full`)
    traktClientOld.get<T[]>(`/search/imdb/${id}?extended=full`)
  )();

export const getSeasonsApi = (id: number, language: Language) => {
  return limiter.wrap(() =>
    traktClient.get<Season[]>(`/shows/${id}/seasons?translations=${language}`)
  )();
};

export const getSeasonEpisodesApi = (
  id: number,
  season: number,
  language: Language
) => {
  return limiter.wrap(() =>
    traktClient.get<Episode[]>(
      `/shows/${id}/seasons/${season}?extended=full&translations=${language}`
    )
  )();
};

export const getProgressApi = (id: number) => {
  return authTraktClient.get<ShowProgress>(
    `/shows/${id}/progress/watched?specials=true&count_specials=false`
  );
};

export const getTranslationsApi = (
  id: string,
  type: ItemType,
  language: Language
) => {
  return limiter.wrap(() =>
    traktClientOld
      .get<Translation[]>(`/${type}s/${id}/translations/${language}`)
      .then(({ data }) => getTranslation(data))
  )();
};

export const searchApi = <T>(
  query: string,
  type: string,
  limit: number = 40
) => {
  return traktClient.get<T[]>(
    `/search/${type}?query=${query}&extended=full&page=1&limit=${limit}`
  );
};

export const getWatchedApi = <T extends MovieWatched | ShowWatched>(
  type: ItemType
) => {
  const url =
    type === 'movie'
      ? `/sync/history/movies?page=1&limit=10000&extended=full`
      : `/sync/watched/shows?extended=full`;

  return authTraktClient.get<T[]>(url);
};

export const addWatchedApi = (
  item: Episode | Season | Movie,
  type: ItemType
) => {
  return authTraktClient.post<AddedWatched>(`/sync/history`, {
    [`${type}s`]: [item],
  });
};

export const removeWatchedApi = (
  item: Episode | Season | Movie,
  type: ItemType
) => {
  return authTraktClient.post<RemovedWatched>(`/sync/history/remove`, {
    [`${type}s`]: [item],
  });
};

export const getWatchlistApi = <T extends MovieWatchlist | ShowWatchlist>(
  type: 'movie' | 'show'
) => {
  return authTraktClient.get<T[]>(
    `/sync/watchlist/${type}s/added?extended=full`
  );
};

export const addWatchlistApi = (item: Show | Movie, type: ItemType) => {
  return authTraktClient.post<AddedWatchlist>(`/sync/watchlist`, {
    [`${type}s`]: [item],
  });
};

export const removeWatchlistApi = (item: Show | Movie, type: ItemType) => {
  return authTraktClient.post<RemovedWatchlist>(`/sync/watchlist/remove`, {
    [`${type}s`]: [item],
  });
};

export const getPeopleApi = (id: string, type: ItemType) => {
  return traktClientOld.get<People>(`/${type}s/${id}/people`);
};

export const getPersonApi = (id: number) => {
  return traktClient.get<Person>(`/people/${id}?extended=full`);
};

export const getPersonItemsApi = <T>(person: string, type: ItemType) => {
  return traktClient.get<T>(`/people/${person}/${type}s?extended=full`);
};

export const getPopularApi = (type: ItemType, limit: number = 40) => {
  const year = new Date().getFullYear();
  return traktClient.get<Popular[]>(
    `/${type}s/watched/weekly?extended=full&page=1&limit=${limit}&years=${year}`
  );
};

export const getRelatedApi = <T>(id: string, type: ItemType) => {
  return traktClientOld.get<T[]>(
    `/${type}s/${id}/related?extended=full&page=1&limit=12`
  );
};

export const getStatsApi = () => {
  return authTraktClient.get<UserStats>(`/users/me/stats`);
};

export const getProfileApi = () => {
  return authTraktClient.get<Profile>(`/users/me`);
};

export const getRatingsApi = (id: string, type: ItemType) => {
  return traktClientOld.get<Ratings>(`/${type}s/${id}/ratings`);
};

export const getCalendar = <T extends MovieCalendar | ShowCalendar>(
  type: ItemType,
  firstDaxios: string,
  period: number
) => {
  return authTraktClient.get<T[]>(
    `/calendars/my/${type}s/${firstDaxios}/${period}`
  );
};

export const getHiddenShows = () => {
  return authTraktClient.get<HiddenShow[]>(
    `/users/hidden/progress_watched?type=show`
  );
};

export const addHideShow = (id: number) => {
  return authTraktClient.post<AddedHidden>(`/users/hidden/progress_watched`, {
    shows: [
      {
        ids: {
          trakt: id,
        },
      },
    ],
  });
};

export const removeHideShow = (id: number) => {
  return authTraktClient.post<RemoveHidden>(
    `/users/hidden/progress_watched/remove`,
    {
      shows: [
        {
          ids: {
            trakt: id,
          },
        },
      ],
    }
  );
};

export const syncActivities = () => {
  return authSimklClient.post<Activities>(`/sync/activities`);
};

export const getAllItems = () => {
  return { data: mockData };
  // return authSimklClient.get<Activities>(
  //   `/sync/all-items?extended=full_anime_seasons&episode_watched_at=yes`
  // );
};

export const getItems = (
  type: 'shows' | 'movies' | 'anime',
  status: 'watching' | 'plantowatch' | 'hold',
  dateFrom: string
) => {
  const params = new URLSearchParams({
    ...(dateFrom ? { date_from: dateFrom } : {}),
  });
  return authSimklClient.get<Activities>(
    `/sync/all-items/${type}/${status}?${params}`
  );
};
