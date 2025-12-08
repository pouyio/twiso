import Dexie, { type EntityTable } from 'dexie';
import { Ids } from '../models/Ids';
import { ShowSeason } from '../models/Show';
import { Translation } from '../models/Translation';

type DBStatus = 'watchlist' | 'watched';

type DBMovieStatus = {
  movie_imdb: string;
  status: DBStatus;
  created_at: string;
};

type DBShowStatus = {
  show_imdb: string;
  status: DBStatus;
  created_at: string;
  hidden: boolean;
  episodes: Array<{
    episode_imdb: string;
    show_imdb: string;
    created_at: string;
    season_number: number;
    episode_number: number;
  }>;
};

export type DBMovieDetail = {
  after_credits: false;
  available_translations: string[];
  certification: string;
  comment_count: number;
  country: string;
  during_credits: boolean;
  genres: string[];
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
  translation?: Translation;
  updated_at: string;
  votes: number;
  year: number | null;
};

type DBShowDetail = {
  aired_episodes: number;
  airs: {
    day: string;
    time: string;
    timezone: string;
  };
  all_seasons: ShowSeason[];
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
  languages: string[];
  network: string;
  original_title: string;
  overview: string;
  rating: number;
  runtime: number;
  status:
    | 'returning series'
    | 'in production'
    | 'planned'
    | 'canceled'
    | 'ended';
  tagline: string;
  title: string;
  trailer: string;
  translation?: Translation;
  updated_at: string;
  votes: number;
  year: number;
};

const db = new Dexie('twisoDB') as Dexie & {
  [DETAIL_MOVIES_TABLE]: EntityTable<DBMovieDetail, 'ids' | 'genres'>; // Key should be ids.imdb, but EntityTable wont allow nested keys
  [DETAIL_SHOWS_TABLE]: EntityTable<DBShowDetail, 'ids' | 'genres'>; // Key should be ids.imdb, but EntityTable wont allow nested keys
  [USER_MOVIES_TABLE]: EntityTable<
    DBMovieStatus,
    'movie_imdb' | 'status' | 'created_at'
  >;
  [USER_SHOWS_TABLE]: EntityTable<
    DBShowStatus,
    'show_imdb' | 'status' | 'created_at'
  >;
};

export const USER_MOVIES_TABLE = 'user-movies';
export const USER_SHOWS_TABLE = 'user-shows';
export const DETAIL_MOVIES_TABLE = 'detail-movies';
export const DETAIL_SHOWS_TABLE = 'detail-shows';

db.version(3).stores({
  [DETAIL_MOVIES_TABLE]: 'ids.imdb,genres',
  [DETAIL_SHOWS_TABLE]: 'ids.imdb,genres',
  [USER_MOVIES_TABLE]: 'movie_imdb,status,created_at',
  [USER_SHOWS_TABLE]: 'show_imdb,status,created_at',
});

export default db;
