import Dexie, { type EntityTable } from 'dexie';
import { Show } from '../models/Show';
import { Translation } from '../models/Translation';
import { Movie } from '../models/Movie';

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

export type DBMovieDetail = Movie & { translation?: Translation };
export type DBShowDetail = Show & { translation?: Translation };

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
