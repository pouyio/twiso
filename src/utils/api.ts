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
import { Session } from 'contexts/AuthContext';
import { ImgConfig } from '../models/ImgConfig';
import { ItemType } from '../models/ItemType';
import { ImageResponse } from '../models/Image';
import {
  Episode,
  Season,
  SeasonEpisode,
  Show,
  ShowProgress,
  ShowSeason,
  ShowWatched,
  ShowWatchlist,
} from '../models/Show';
import { Language, Translation } from '../models/Translation';
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
  EpisodeProgress,
  HiddenShow,
  MovieCalendar,
  Profile,
  Ratings,
  RemovedWatched,
  RemovedWatchlist,
  RemoveHidden,
  ShowCalendar,
  StatusAnime,
  StatusMovie,
  StatusShow,
  UserStats,
} from '../models/Api';
import { People } from '../models/People';
import { Person } from '../models/Person';
import { Popular } from '../models/Popular';
import { Ids } from 'models/Ids';
import { supabase } from './supabase';

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
    traktClientOld.get<T[]>(`/search/imdb/${id}?extended=full`)
  )();

export const getSeasonsApi = (id: string, language: Language) => {
  return limiter.wrap(() =>
    traktClientOld
      .get<Season[]>(
        `/shows/${id}/seasons?extended=episodes&translations=${language}`
      )
      .then(({ data }) => data)
  )();
};

export const getSeasonEpisodesApi = (
  id: string,
  season: number,
  language: Language
) => {
  return limiter.wrap(() =>
    traktClientOld.get<Episode[]>(
      `/shows/${id}/seasons/${season}?extended=full&translations=${language}`
    )
  )();
};

export const getProgressApi = (id: string) => {
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
      .then(({ data }) =>
        data.find((t) => t.language === 'es' && t.country === 'es')
      )
  )();
};

export const searchApi = <T>(
  query: string,
  type: string,
  limit: number = 40
) => {
  return traktClientOld.get<T[]>(
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

export const addWatchedApis = (
  item: Array<SeasonEpisode | Season | Movie>,
  type: ItemType
) => {
  return authSimklClient.post<AddedWatched>(`/sync/history`, {
    [`${type}s`]: item,
  });
};
export const addWatchedApi = (id: string, type: ItemType) => {
  return supabase.functions.invoke(`api/${type}s/${id}`, {
    method: 'POST',
    body: {
      status: 'watched',
    },
  });
};

export const addWatchedEpisodesApi = (
  showIds: Ids,
  episodes: SeasonEpisode[]
) => {
  return supabase.functions.invoke(`api/shows/${showIds.imdb}/episodes`, {
    method: 'POST',
    body: {
      episodes: episodes.map((e) => ({
        episodeId: e.ids.imdb,
        season: e.season,
        episode: e.number,
      })),
    },
  });
};

export const removeWatchedEpisodesApi = (showIds: Ids, episodeIds: Ids[]) => {
  return supabase.functions.invoke(`api/shows/${showIds.imdb}/episodes`, {
    method: 'DELETE',
    body: {
      episodes: episodeIds.map((e) => e.imdb),
    },
  });
};

export const removeWatchedSeasonsApi = (showIds: Ids, season: number) => {
  return authSimklClient.post<RemovedWatched>(`/sync/history/remove`, {
    shows: [
      {
        ids: showIds,
        seasons: [{ number: season }],
      },
    ],
  });
};

export const removeWatchedApi = (id: string, type: ItemType) => {
  return supabase.functions.invoke(`api/${type}s/${id}`, {
    method: 'DELETE',
  });
};

export const removeWatchedShowsApis = (payload: any[]) => {
  return authSimklClient.post<RemovedWatched>(`/sync/history/remove`, {
    shows: payload,
  });
};

export const getWatchlistApi = <T extends MovieWatchlist | ShowWatchlist>(
  type: 'movie' | 'show'
) => {
  return authTraktClient.get<T[]>(
    `/sync/watchlist/${type}s/added?extended=full`
  );
};

export const addWatchlistApi = (id: string, type: 'movie' | 'show') => {
  return supabase.functions.invoke(`api/${type}s/${id}`, {
    method: 'POST',
    body: {
      status: 'watchlist',
    },
  });
};

export const removeWatchlistApi = (id: string, type: ItemType) => {
  return supabase.functions.invoke(`api/${type}s/${id}`, {
    method: 'DELETE',
  });
};

export const getPeopleApi = (id: string, type: ItemType) => {
  return traktClientOld.get<People>(`/${type}s/${id}/people`);
};

export const getPersonApi = (id: number) => {
  return traktClientOld.get<Person>(`/people/${id}?extended=full`);
};

export const getPersonItemsApi = <T>(person: string, type: ItemType) => {
  return traktClientOld.get<T>(`/people/${person}/${type}s?extended=full`);
};

export const getPopularApi = (type: ItemType, limit: number = 40) => {
  const year = new Date().getFullYear();
  return traktClientOld.get<Popular[]>(
    `/${type}s/watched/weekly?extended=full&page=1&limit=${limit}&years=${year}`
  );
};

export const getRelatedApi = async <T>(type: ItemType, id?: string) => {
  return id
    ? traktClientOld.get<T[]>(
        `/${type}s/${id}/related?extended=full&page=1&limit=12`
      )
    : { data: [] };
};

export const getStatsApi = () => {
  return supabase.functions.invoke('api/profile', {
    method: 'GET',
  });
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

export const setHideShow = (showId: string, hidden: boolean) => {
  return supabase.functions.invoke(`api/shows/${showId}/hide`, {
    method: 'PUT',
    body: {
      hidden,
    },
  });
};

export const syncActivities = () => {
  return supabase.functions.invoke(`api/activities`, {
    method: 'GET',
  });
};

export const getAllMoviesIds = async () => {
  return supabase.functions
    .invoke(`api/movies`, {
      method: 'GET',
    })
    .then(({ data }) => data.map((m) => m.movie_imdb));
};

export const getAllShowsIds = async () => {
  return supabase.functions
    .invoke(`api/shows`, {
      method: 'GET',
    })
    .then(({ data }) => data.map((m) => m.show_imdb));
};

export const getAllAnimeIds = async () => {
  return authSimklClient
    .get<{ anime: StatusAnime[] } | null>(
      `/sync/all-items/anime?extended=ids_only`
    )
    .then(({ data }) => data?.anime.map((s) => s.show.ids.imdb) ?? []);
};
export const getAllMovies = (dateFrom?: string | null) => {
  return supabase.functions.invoke(
    `api/movies?${dateFrom ? `date_from=${encodeURIComponent(dateFrom)}` : ''}`,
    {
      method: 'GET',
    }
  );
};
export const getAllAnimes = (dateFrom?: string | null) => {
  return authSimklClient.get<{ anime: StatusAnime[] } | null>(
    `/sync/all-items/anime/?extended=full${
      dateFrom ? `&date_from=${encodeURIComponent(dateFrom)}` : ''
    }`
  );
};
export const getAllShows = (dateFrom?: string | null) => {
  return supabase.functions.invoke(
    `api/shows/complete?${
      dateFrom ? `date_from=${encodeURIComponent(dateFrom)}` : ''
    }`,
    {
      method: 'GET',
    }
  );
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
