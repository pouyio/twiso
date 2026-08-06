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

export interface Movie {
  country: string;
  genres: number[];
  homepage: string | null;
  ids: Ids;
  language: string;
  languages: string[];
  original_title: string;
  overview: string;
  rating: number;
  released: string | null;
  runtime: number;
  status:
    | 'released'
    | 'in production'
    | 'post production'
    | 'planned'
    | 'rumored'
    | 'canceled';
  tagline: string;
  title: string;
  trailer: string;
  votes: number;
  year: number | null;
}
