import { ItemType } from './ItemType';
import { Ids } from './Ids';

interface SearchItem {
  score: number;
  type: ItemType;
}

export type Item = any;

export type SearchShow = SearchItem & {
  show: Show;
};

export type SearchMovie = SearchItem & {
  movie: Movie;
};

export type SearchPerson = SearchItem & {
  person: Person;
};

export interface MovieWatchlist {
  id: number;
  listed_at: string;
  rank: number;
  type: 'movie';
  movie: Movie;
}

export interface ShowWatchlist {
  id: number;
  listed_at: string;
  rank: number;
  type: 'show';
  show: Show;
}

export type MovieWatched = MovieWatchlist;

export interface ShowWatched {
  last_updated_at: string;
  last_watched_at: string;
  plays: number;
  reset_at: string;
  listed_at: string;
  seasons: Array<{
    episodes: Array<{
      last_watched_at: string;
      number: number;
      plays: number;
    }>;
    number: number;
  }>;
  show: Show;
  type: 'show';
}

interface SmallEpisode {
  ids: Ids;
  number: number;
  season: number;
  title: string;
}

export interface ShowProgress {
  aired: number;
  completed: number;
  hidden_seasons: any[];
  last_episode: SmallEpisode;
  last_watched_at: string;
  next_episode: SmallEpisode;
  reset_at: string;
  seasons: Season[];
}

export interface Movie {
  available_translations: string[];
  certification: string;
  comment_count: number;
  country: string;
  genres: string[];
  homepage: string;
  ids: Ids;
  language: string;
  overview: string;
  rating: number;
  released: string;
  runtime: number;
  tagline: string;
  title: string;
  trailer: string;
  updated_at: string;
  votes: number;
  year: number;
}

export type Person = any;

export interface Show {
  aired_episodes: number;
  airs: {
    day: string;
    time: any;
    timezone: string;
  };
  available_translations: string[];
  certification: string;
  comment_count: number;
  country: any;
  first_aired: any;
  genres: string[];
  homepage: string;
  ids: Ids & {
    tvrage: any;
  };
  language: string;
  network: any;
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

export interface Season {
  episodes: Episode[];
  ids: Ids;
  number: number;
  completed: number;
}

export interface Episode {
  ids: Ids;
  number: number;
  season: number;
  title: string;
  translations: any[];
  completed: boolean;
}
