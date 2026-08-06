import Dexie, { type EntityTable } from 'dexie';
import { Show } from '../models/Show';
import { Translation } from '../models/Translation';
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

export type DBMovieDetail = Movie & { translation?: Translation };
export type DBShowDetail = Show & { translation?: Translation };

// New DB name: Dexie cannot change a store's primary key in place, so reusing
// 'twisoDB' (v3, keyed by imdb) would need a delete+recreate across two
// versions. A fresh DB is created directly at version 4 keyed by tmdb ids.
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

export const dbReady = db
  .open()
  .then(() => {
    if (!localStorage.getItem('twiso-migrated-v4')) {
      localStorage.setItem('twiso-migrated-v4', '1');
      localStorage.removeItem('activities');
    }
  })
  .catch(() => {});

export default db;
