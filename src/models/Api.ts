import { Ids } from './Ids';
import { SmallEpisode } from './Show';

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

export interface HiddenShow {
  hidden_at: string;
  type: 'show';
  show: {
    title: string;
    year: number;
    ids: Ids;
  };
}

export interface AddedHidden {
  added: ItemsCount;
  not_found: BaseNotFound;
}

export interface RemoveHidden {
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
  movies: {
    plays: number;
    watched: number;
    minutes: number;
    collected: number;
    ratings: number;
    comments: number;
  };
  shows: {
    watched: number;
    collected: number;
    ratings: number;
    comments: number;
  };
  seasons: {
    ratings: number;
    comments: number;
  };
  episodes: {
    plays: number;
    watched: number;
    minutes: number;
    collected: number;
    ratings: number;
    comments: number;
  };
  network: {
    friends: number;
    followers: number;
    following: number;
  };
  ratings: {
    total: number;
    distribution: Distribution;
  };
}

export interface Ratings {
  rating: number;
  votes: number;
  distribution: Distribution;
}

export interface Profile {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: {
    slug: string;
  };
}

export interface MovieCalendar {
  movie: { title: string; year: number; ids: Ids };
  released: string;
}
export interface ShowCalendar {
  first_aired: string;
  episode: SmallEpisode;
  show: {
    title: string;
    year: number;
    ids: Ids;
  };
}

export type Activities = {
  all: string | null;
  settings: {
    all: string | null;
  };
  tv_shows: {
    all: string | null;
    rated_at: string | null;
    plantowatch: string | null;
    watching: string | null;
    completed: string | null;
    hold: string | null;
    dropped: string | null;
    removed_from_list: string | null;
  };
  anime: {
    all: string | null;
    rated_at: string | null;
    plantowatch: string | null;
    watching: string | null;
    completed: string | null;
    hold: null;
    dropped: string | null;
    removed_from_list: string | null;
  };
  movies: {
    all: string | null;
    rated_at: string | null;
    plantowatch: string | null;
    completed: string | null;
    dropped: string | null;
    removed_from_list: string | null;
  };
};
