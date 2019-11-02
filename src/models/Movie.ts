import { ItemType } from './ItemType';
import { Ids } from './Ids';
import { Show } from './Show';
import { Person } from './Person';

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
  person: Person;
};

export interface MovieWatchlist {
  id: number;
  listed_at: string;
  rank: number;
  type: 'movie';
  movie: Movie;
}

export type MovieWatched = {
  action?: string;
  id?: number;
  movie: Movie;
  type: 'movie';
  watched_at: string;
};

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
