import Dexie from 'dexie';

const db = new Dexie('twisoDB');

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
