import Dexie from 'dexie';

const db = new Dexie('twisoDB');

db.version(1).stores({
  movies: 'movie.ids.trakt,localState',
  shows: 'show.ids.trakt,localState',
});
db.version(2).stores({
  movies: 'movie.ids.trakt,localState',
  shows: 'show.ids.trakt,localState',
  'shows-hidden': 'trakt',
});

export default db;
