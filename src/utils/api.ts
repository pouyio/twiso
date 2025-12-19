import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { config, IMG_URL } from './apiConfig';
import { traktClient } from './axiosClients';
import Bottleneck from 'bottleneck';
import { ImgConfig } from '../models/ImgConfig';
import { ItemType } from '../models/ItemType';
import { ImageResponse } from '../models/Image';
import { Episode, Season, SeasonEpisode } from '../models/Show';
import { Language, Translation } from '../models/Translation';
import { SearchMovie, SearchShow } from '../models/Movie';
import {
  Activity,
  EpisodeStatus,
  MovieStatus,
  Ratings,
  Release,
  ShowStatus,
  ShowStatusComplete,
  Studio,
  UserStats,
} from '../models/Api';
import { People } from '../models/People';
import { Person } from '../models/Person';
import { Popular } from '../models/Popular';
import { Ids } from '../models/Ids';
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

export const getApi = <T extends SearchMovie | SearchShow>(
  id: string,
  type: 'movie' | 'show'
) => {
  return limiter.wrap(() =>
    traktClient.get<T[]>(`/search/imdb/${id}?type=${type}&extended=full`)
  )();
};

export const getSeasonsApi = (id: string, language: Language) => {
  return limiter.wrap(() =>
    traktClient
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
    traktClient.get<Episode[]>(
      `/shows/${id}/seasons/${season}?extended=full&translations=${language}`
    )
  )();
};

export const getTranslationsApi = (
  id: string,
  type: ItemType,
  language: Language
) => {
  return limiter.wrap(() =>
    traktClient
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
  return traktClient.get<T[]>(
    `/search/${type}?query=${query}&extended=full&page=1&limit=${limit}`
  );
};

export const addWatchedMovieApi = (id: string, type: ItemType) => {
  return supabase.functions.invoke<MovieStatus>(`api/${type}s/${id}`, {
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
  return supabase.functions.invoke<EpisodeStatus[]>(
    `api/shows/${showIds.imdb}/episodes`,
    {
      method: 'POST',
      body: {
        episodes: episodes.map((e) => ({
          episodeId: e.ids.imdb,
          season: e.season,
          episode: e.number,
        })),
      },
    }
  );
};

export const removeWatchedEpisodesApi = (
  showIds: Ids,
  episodes: SeasonEpisode[]
) => {
  return supabase.functions.invoke<null>(`api/shows/${showIds.imdb}/episodes`, {
    method: 'DELETE',
    body: {
      episodes: episodes.map((e) => ({
        episodeId: e.ids.imdb,
        season: e.season,
        episode: e.number,
      })),
    },
  });
};

export const removeWatchedApi = (id: string, type: ItemType) => {
  return supabase.functions.invoke<null>(`api/${type}s/${id}`, {
    method: 'DELETE',
  });
};

export const addWatchlistShowApi = (id: string) => {
  return supabase.functions.invoke<ShowStatus>(`api/shows/${id}`, {
    method: 'POST',
    body: {
      status: 'watchlist',
    },
  });
};

export const addWatchlistMovieApi = (id: string) => {
  return supabase.functions.invoke<MovieStatus>(`api/movies/${id}`, {
    method: 'POST',
    body: {
      status: 'watchlist',
    },
  });
};

export const removeWatchlistApi = (id: string, type: ItemType) => {
  return supabase.functions.invoke<null>(`api/${type}s/${id}`, {
    method: 'DELETE',
  });
};

export const getPeopleApi = (id: string, type: ItemType) => {
  return traktClient.get<People>(`/${type}s/${id}/people`);
};

export const getPersonApi = (id: string) => {
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

export const getRelatedApi = async <T>(type: ItemType, id?: string) => {
  return id
    ? traktClient.get<T[]>(
        `/${type}s/${id}/related?extended=full&page=1&limit=12`
      )
    : { data: [] };
};

export const getStatsApi = () => {
  return supabase.functions.invoke<UserStats>('api/profile', {
    method: 'GET',
  });
};

export const getRatingsApi = (id: string, type: ItemType) => {
  return traktClient.get<Ratings>(`/${type}s/${id}/ratings`);
};

export const getStudiosApi = (id: string, type: ItemType) => {
  return traktClient.get<Studio[]>(`/${type}s/${id}/studios`);
};

export const getMovieReleasesApi = (id: string) => {
  return traktClient.get<Release[]>(`/movies/${id}/releases/es`);
};

export const setHideShow = (showId: string, hidden: boolean) => {
  return supabase.functions.invoke<null>(`api/shows/${showId}/hide`, {
    method: 'PUT',
    body: {
      hidden,
    },
  });
};

export const syncActivities = () => {
  return supabase.functions.invoke<Activity>(`api/activities`, {
    method: 'GET',
  });
};

export const getAllShows = async () => {
  return supabase.functions.invoke<ShowStatus[]>(`api/shows`, {
    method: 'GET',
  });
};

export const getAllMovies = (dateFrom?: string | null) => {
  return supabase.functions.invoke<MovieStatus[]>(
    `api/movies?${dateFrom ? `date_from=${encodeURIComponent(dateFrom)}` : ''}`,
    {
      method: 'GET',
    }
  );
};

export const getAllShowsComplete = (dateFrom?: string | null) => {
  return supabase.functions.invoke<ShowStatusComplete[]>(
    `api/shows/complete?${
      dateFrom ? `date_from=${encodeURIComponent(dateFrom)}` : ''
    }`,
    {
      method: 'GET',
    }
  );
};
