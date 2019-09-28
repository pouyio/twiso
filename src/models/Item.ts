import { ItemType } from './ItemType';

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

export type Movie = any;

export type Person = any;

export interface Show {
  aired_episodes: number;
  airs: {
    day: string;
    time: any;
    timezone: string;
  };
  available_translations: any[];
  certification: any;
  comment_count: number;
  country: any;
  first_aired: any;
  genres: string[];
  homepage: any;
  ids: {
    trakt: number;
    slug: string;
    tvdb: number;
    imdb: any;
    tmdb: any;
    tvrage: any;
  };
  language: any;
  network: any;
  overview: any;
  rating: number;
  runtime: number;
  status: string;
  title: string;
  trailer: any;
  updated_at: string;
  votes: number;
  year: number;
}
