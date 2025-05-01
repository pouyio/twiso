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
db.version(3).stores({
  'movies-s': 'movie.ids.simkl,movie.ids.traktslug,status',
  'shows-s': 'show.ids.simkl,show.ids.traktslug,status',
  'animes-s': 'show.ids.simkl,show.ids.traktslug,status',
});

export default db;
