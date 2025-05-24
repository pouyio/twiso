import { Ids } from './Ids';
import { ShowSeason, SmallEpisode } from './Show';

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
  movies: number;
  episodes: number;
}

export interface Ratings {
  rating: number;
  votes: number;
  distribution: Distribution;
}

export interface Profile {
  user: {
    name: string;
    joined_at: string;
    gender: string;
    avatar: string;
    bio: string;
    loc: string;
    age: string;
  };
  account: {
    id: number;
    timezone: string;
    type: string;
  };
  connections: {
    facebook: boolean;
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

export type StatusAnime = {
  anime_type: 'tv' | 'special' | 'ova' | 'movie' | 'music video' | 'ona';
  show: {
    ids: Ids;
    title: string;
    poster: string;
    year: number;
  };
  last_watched: string | null;
  next_to_watch: string | null;
  added_to_watchlist_at: string | null;
  last_watched_at: string | null;
  not_aired_episodes_count: number;
  status: SimklStatus;
  total_episodes_count: number;
  user_rated_at: string | null;
  user_rating: string | null;
  watched_episodes_count: string;
};

export type StatusMovie = {
  created_at: string | null;
  movie_imdb: string;
  status: SimklStatus;
};

export type StatusSeason = ShowSeason & { episodes: Array<{ number: number }> };

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
