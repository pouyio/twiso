import Dexie, { type EntityTable } from 'dexie';
import { Show } from '../models/Show';
import { Translation, Language } from '../models/Translation';
import { Movie } from '../models/Movie';

type DBStatus = 'watchlist' | 'watched';

type DBMovieStatus = {
  movie_tmdb: number;
  status: DBStatus;
  created_at: string;
};

type DBShowStatus = {
  show_tmdb: number;
  status: DBStatus;
  created_at: string;
  hidden: boolean;
  episodes: Array<{
    episode_tmdb: number;
    show_tmdb: number;
    created_at: string;
    season_number: number;
    episode_number: number;
  }>;
};

export type DBMovieDetail = Movie & {
  translation?: Translation;
  contentLanguage?: Language;
};
export type DBShowDetail = Show & {
  translation?: Translation;
  contentLanguage?: Language;
};

const db = new Dexie('twisoDB4') as Dexie & {
  [DETAIL_MOVIES_TABLE]: EntityTable<DBMovieDetail, 'ids' | 'genres'>; // Key should be ids.tmdb, but EntityTable wont allow nested keys
  [DETAIL_SHOWS_TABLE]: EntityTable<DBShowDetail, 'ids' | 'genres'>; // Key should be ids.tmdb, but EntityTable wont allow nested keys
  [USER_MOVIES_TABLE]: EntityTable<
    DBMovieStatus,
    'movie_tmdb' | 'status' | 'created_at'
  >;
  [USER_SHOWS_TABLE]: EntityTable<
    DBShowStatus,
    'show_tmdb' | 'status' | 'created_at'
  >;
};

export const USER_MOVIES_TABLE = 'user-movies';
export const USER_SHOWS_TABLE = 'user-shows';
export const DETAIL_MOVIES_TABLE = 'detail-movies';
export const DETAIL_SHOWS_TABLE = 'detail-shows';

db.version(4).stores({
  [DETAIL_MOVIES_TABLE]: 'ids.tmdb,genres',
  [DETAIL_SHOWS_TABLE]: 'ids.tmdb,genres',
  [USER_MOVIES_TABLE]: 'movie_tmdb,status,created_at',
  [USER_SHOWS_TABLE]: 'show_tmdb,status,created_at',
});

export const dbReady = db.open().catch(() => {});

export default db;
