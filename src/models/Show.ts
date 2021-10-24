import { Ids } from './Ids';

interface BaseShow {
  listed_at: string;
  show: Show;
  type: 'show';
}
export interface ShowWatched extends BaseShow {
  last_updated_at: string;
  last_watched_at: string;
  plays: number;
  reset_at: string;
  progress?: ShowProgress;
  fullSeasons?: Season[];
  seasons?: Season[];
  localState: 'watched';
}

export interface ShowWatchlist extends BaseShow {
  id?: number;
  rank?: number;
  localState: 'watchlist';
  fullSeasons?: Season[];
  progress?: ShowProgress;
  last_watched_at?: string;
}

export interface Show {
  aired_episodes: number;
  airs: {
    day: string;
    time: string;
    timezone: string;
  };
  available_translations: string[];
  certification: string;
  comment_count: number;
  country: string;
  first_aired: string;
  genres: string[];
  homepage: string;
  ids: Ids & {
    tvrage: any;
  };
  language: string;
  network: string;
  overview: string;
  rating: number;
  runtime: number;
  status:
    | 'returning series'
    | 'in production'
    | 'planned'
    | 'canceled'
    | 'ended';
  title: string;
  trailer: string;
  updated_at: string;
  votes: number;
  year: number;
}

export interface SmallEpisode {
  ids: Ids;
  number: number;
  season: number;
  title: string;
}

export interface Episode {
  ids: Ids;
  number: number;
  number_abs: 14;
  season: number;
  title: string;
  overview: string;
  available_translations: string[];
  translations: {
    title: string;
    overview: string;
    tagline: string;
    language: string;
  }[];
  completed: boolean;
  comment_count: number;
  first_aired: string;
  rating: number;
  runtime: number;
  updated_at: string;
  votes: string;
}

export interface Season {
  episodes: Episode[];
  ids: Ids;
  number: number;
  completed: number;
}

export interface ShowProgress {
  aired: number;
  completed: number;
  hidden_seasons: any[];
  last_episode: SmallEpisode;
  last_watched_at: string;
  next_episode?: SmallEpisode;
  reset_at: string;
  seasons: Season[];
}
