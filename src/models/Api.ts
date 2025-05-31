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

export type AddedWatched = {
  movie_imdb: string;
  status: 'watchlist' | 'watched';
  created_at: string;
} | null;

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

type Status = 'watched' | 'watchlist';

export type MovieStatus = {
  movie_imdb: string;
  status: Status;
  created_at: string;
};

export type ShowStatus = {
  show_imdb: string;
  status: Status;
  created_at: string;
  hidden: boolean;
};

export type ShowStatusComplete = ShowStatus & {
  episodes: EpisodeStatus[];
};

export type EpisodeStatus = {
  episode_imdb: string;
  show_imdb: string;
  created_at: string;
  season_number: number;
  episode_number: number;
};

export type Activity = {
  movies: {
    removed: string | null;
    rest: string | null;
  };
  shows: {
    removed: string | null;
    rest: string | null;
  };
};
