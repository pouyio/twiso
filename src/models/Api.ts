import { Ids } from './Ids';

interface BaseNotFound {
  movies?: Ids[];
  shows?: Ids[];
  seasons?: Ids[];
  episodes?: Ids[];
}

interface ItemsCount {
  movies?: number;
  episodes?: number;
  shows?: number;
  seasons?: number;
}

export interface AddedWatched {
  added: ItemsCount;
  not_found: BaseNotFound;
}
export interface RemovedWatched {
  deleted: ItemsCount;
  not_found: BaseNotFound & { ids: number[] };
}

export interface AddedWatchlist {
  added: ItemsCount;
  existing: ItemsCount;
  not_found: BaseNotFound;
}

export interface RemovedWatchlist {
  deleted: ItemsCount;
  not_found: BaseNotFound;
}

interface Distribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
  '7': number;
  '8': number;
  '9': number;
  '10': number;
}

export interface UserStats {
  movies: number;
  episodes: number;
}

export interface Ratings {
  rating: number;
  votes: number;
  distribution: Distribution;
}

export type Activities = {
  shows: {
    rest: string | null;
    removed: string | null;
  };
  movies: {
    rest: string | null;
    removed: string | null;
  };
};

export type SimklStatus = 'watched' | 'watchlist' | 'hidden';

export type StatusMovie = {
  created_at: string | null;
  movie_imdb: string;
  status: SimklStatus;
};

export type EpisodeProgress = {
  created_at: string;
  episode_imdb: string;
  episode_number: number;
  season_number: number;
  show_imdb: string;
};

export type StatusShow = {
  created_at: string;
  status: SimklStatus;
  show_imdb: string;
  hidden: boolean;
  episodes: EpisodeProgress[];
};
