import Dexie from 'dexie';

const db = new Dexie('twisoDB');

db.version(1).stores({
  movies: 'movie.ids.trakt,localState',
  shows: 'show.ids.trakt,localState',
});

export default db;
