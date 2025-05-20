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
  total_mins: number;
  movies: {
    total_mins: number;
    plantowatch: {
      mins: number;
      count: number;
    };
    dropped: {
      mins: number;
      count: number;
    };
    completed: {
      mins: number;
      count: number;
    };
  };
  tv: {
    total_mins: number;
    watching: {
      watched_episodes_count: number;
      count: number;
      left_to_watch_episodes: number;
      left_to_watch_mins: number;
      total_episodes_count: number;
    };
    hold: {
      watched_episodes_count: number;
      count: number;
      left_to_watch_episodes: number;
      left_to_watch_mins: number;
      total_episodes_count: number;
    };
    plantowatch: {
      watched_episodes_count: number;
      count: number;
      left_to_watch_episodes: number;
      left_to_watch_mins: number;
      total_episodes_count: number;
    };
    dropped: {
      watched_episodes_count: number;
      count: number;
    };
    completed: {
      watched_episodes_count: number;
      count: number;
    };
  };
  anime: {
    total_mins: number;
    watching: {
      watched_episodes_count: number;
      count: number;
      left_to_watch_episodes: number;
      left_to_watch_mins: number;
      total_episodes_count: number;
    };
    hold: {
      watched_episodes_count: number;
      count: number;
      left_to_watch_episodes: number;
      left_to_watch_mins: number;
      total_episodes_count: number;
    };
    plantowatch: {
      watched_episodes_count: number;
      count: number;
      left_to_watch_episodes: number;
      left_to_watch_mins: number;
      total_episodes_count: number;
    };
    dropped: {
      watched_episodes_count: number;
      count: number;
    };
    completed: {
      watched_episodes_count: number;
      count: number;
    };
  };
  watched_last_week: {
    total_mins: number;
    movies_mins: number;
    tv_mins: number;
    anime_mins: number;
  };
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

export type SimklStatus =
  | 'plantowatch'
  | 'hold'
  | 'completed'
  | 'removed_from_list'
  | 'dropped'
  | 'watching';

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
  added_to_watchlist_at: string | null;
  last_watched_at: string | null;
  movie: {
    ids: Ids;
    title: string;
    poster: string;
    year: number;
  };
  not_aired_episodes_count: number;
  status: SimklStatus;
  total_episodes_count: number;
  user_rated_at: string | null;
  user_rating: string | null;
  watched_episodes_count: string;
};

export type StatusSeason = ShowSeason & { episodes: Array<{ number: number }> };

export type StatusShow = {
  added_to_watchlist_at: string | null;
  last_watched_at: string | null;
  user_rated_at: string | null;
  user_rating: string | null;
  status: SimklStatus;
  watched_episodes_count: number;
  total_episodes_count: number;
  not_aired_episodes_count: number;
  last_watched: string; // 'S01E01'
  next_to_watch: string; // 'S01E01'
  seasons?: StatusSeason[]; // if completed this is undefined
  show: {
    title: string;
    poster: string;
    year: number;
    ids: Ids;
  };
};
