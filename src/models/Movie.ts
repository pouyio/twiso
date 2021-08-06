import { ItemType } from './ItemType';
import { Ids } from './Ids';
import { Show } from './Show';
import { Person } from './Person';

interface SearchItem {
  score: number;
  type: ItemType;
}

interface BaseMovie {
  movie: Movie;
  type: 'movie';
}

export type SearchShow = SearchItem & {
  show: Show;
};

export type SearchMovie = SearchItem & {
  movie: Movie;
};

export type SearchPerson = SearchItem & {
  person: Person;
};

export interface MovieWatchlist extends BaseMovie {
  id?: number;
  listed_at: string;
  rank?: number;
  localState: 'watchlist';
}

export interface MovieWatched extends BaseMovie {
  action?: string;
  id?: number;
  watched_at: string;
  localState: 'watched';
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
