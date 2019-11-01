import { ItemType } from './ItemType';
import { Ids } from './Ids';
import { Show } from './Show';
import { IPerson } from './IPerson';

interface SearchItem {
  score: number;
  type: ItemType;
}

export type SearchShow = SearchItem & {
  show: Show;
};

export type SearchMovie = SearchItem & {
  movie: Movie;
};

export type SearchPerson = SearchItem & {
  person: IPerson;
};

export interface MovieWatchlist {
  id: number;
  listed_at: string;
  rank: number;
  type: 'movie';
  movie: Movie;
}

export interface ShowWatchlist {
  id?: number;
  listed_at?: string;
  rank?: number;
  type: 'show';
  show: Show;
}

export type MovieWatched = {
  action?: string;
  id?: number;
  movie: Movie;
  type: 'movie';
  watched_at: string;
};

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
