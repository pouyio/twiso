import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { config, IMG_URL } from './apiConfig';
import { ImgConfig } from '../models/ImgConfig';
import { ItemType } from '../models/ItemType';
import { ImageResponse } from '../models/Image';
import { Season, SeasonEpisode, Show } from '../models/Show';
import { Language, Translation } from '../models/Translation';
import { Movie } from '../models/Movie';
import {
  Activity,
  EpisodeStatus,
  MovieStatus,
  Ratings,
  Release,
  SeasonRating,
  ShowRating,
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

const getTmdb = async <T>(path: string): Promise<T> => {
  const { data, error } = await supabase.functions.invoke<T>(
    `api/tmdb${path}`,
    {
      method: 'GET',
    }
  );
  if (error) {
    throw error;
  }
  return data as T;
};

const typeSegment = (type: ItemType) =>
  type === 'show' ? 'shows' : 'movies';

export const getMovieApi = (id: number, language: Language = 'es') => {
  return getTmdb<Movie>(`/movies/${id}?language=${language}`);
};

export const getShowApi = (id: number, language: Language = 'es') => {
  return getTmdb<Show>(`/shows/${id}?language=${language}`);
};

export const getSeasonsApi = (id: number, language: Language) => {
  return getTmdb<Season[]>(`/shows/${id}/seasons?language=${language}`);
};

export const getTranslationsApi = (
  id: number,
  type: ItemType,
  language: Language
) => {
  return getTmdb<Translation | null>(
    `/${typeSegment(type)}/${id}/translations/${language}`
  );
};

export const searchApi = <T>(
  query: string,
  type: string,
  limit: number = 40
) => {
  return getTmdb<T[]>(
    `/search?query=${encodeURIComponent(query)}&type=${type}&limit=${limit}`
  );
};

export const addWatchedMovieApi = (id: number, type: ItemType) => {
  return supabase.functions.invoke<MovieStatus>(`api/${typeSegment(type)}/${id}`, {
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
    `api/shows/${showIds.tmdb}/episodes`,
    {
      method: 'POST',
      body: {
        episodes: episodes.map((e) => ({
          episodeId: e.ids.tmdb,
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
  return supabase.functions.invoke<null>(`api/shows/${showIds.tmdb}/episodes`, {
    method: 'DELETE',
    body: {
      episodes: episodes.map((e) => ({
        episodeId: e.ids.tmdb,
        season: e.season,
        episode: e.number,
      })),
    },
  });
};

export const removeWatchedApi = (id: number, type: ItemType) => {
  return supabase.functions.invoke<null>(`api/${typeSegment(type)}/${id}`, {
    method: 'DELETE',
  });
};

export const addWatchlistShowApi = (id: number) => {
  return supabase.functions.invoke<ShowStatus>(`api/shows/${id}`, {
    method: 'POST',
    body: {
      status: 'watchlist',
    },
  });
};

export const addWatchlistMovieApi = (id: number) => {
  return supabase.functions.invoke<MovieStatus>(`api/movies/${id}`, {
    method: 'POST',
    body: {
      status: 'watchlist',
    },
  });
};

export const removeWatchlistApi = (id: number, type: ItemType) => {
  return supabase.functions.invoke<null>(`api/${typeSegment(type)}/${id}`, {
    method: 'DELETE',
  });
};

export const getPeopleApi = (id: number, type: ItemType, language: Language = 'es') => {
  return getTmdb<People>(
    `/${typeSegment(type)}/${id}/people?language=${language}`
  );
};

export const getPersonApi = (id: number, language: Language = 'es') => {
  return getTmdb<Person>(`/people/${id}?language=${language}`);
};

export const getPersonItemsApi = <T>(
  person: number,
  type: ItemType,
  language: Language = 'es'
) => {
  return getTmdb<T>(`/people/${person}/${typeSegment(type)}?language=${language}`);
};

export const getPopularApi = (type: ItemType, limit: number = 40) => {
  return getTmdb<Popular[]>(`/${typeSegment(type)}/trending?limit=${limit}`);
};

export const getRelatedApi = async <T>(type: ItemType, id?: number) => {
  return id
    ? getTmdb<T[]>(`/${typeSegment(type)}/${id}/related?limit=12`)
    : [];
};

export const getStatsApi = () => {
  return supabase.functions.invoke<UserStats>('api/profile', {
    method: 'GET',
  });
};

export const getRatingsApi = (id: number, type: ItemType) => {
  return getTmdb<Ratings>(`/${typeSegment(type)}/${id}/ratings`);
};

export const getStudiosApi = (id: number, type: ItemType) => {
  return getTmdb<Studio[]>(`/${typeSegment(type)}/${id}/studios`);
};

export const getShowSeasonRatingsApi = (showId: number) => {
  return supabase.functions.invoke<SeasonRating[]>(
    `api/season-ratings/${showId}`,
    { method: 'GET' }
  );
};

export const getShowRatingsApi = (showId: number) => {
  return supabase.functions.invoke<ShowRating>(
    `api/show-ratings/${showId}`,
    { method: 'GET' }
  );
};

export const getMovieReleasesApi = (id: number) => {
  return getTmdb<Release[]>(`/movies/${id}/releases/es`);
};

export const setHideShow = (showId: number, hidden: boolean) => {
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
