import db from '../utils/db';

export const dbMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case 'movies/setWatched': {
      db.table('movies')
        .where('localState')
        .equals('watched')
        .delete()
        .then(() => {
          db.table('movies').bulkPut(
            action.payload.map((m) => {
              return { ...m, localState: 'watched' };
            })
          );
        });
      break;
    }
    case 'movies/addWatched': {
      db.table('movies').put({ ...action.payload, localState: 'watched' });
      break;
    }
    case 'movies/removeWatched': {
      db.table('movies').delete(action.payload.ids.trakt);
      break;
    }
    case 'movies/setWatchlist':
      db.table('movies')
        .where('localState')
        .equals('watchlist')
        .delete()
        .then(() => {
          db.table('movies').bulkPut(
            action.payload.map((m) => {
              return { ...m, localState: 'watchlist' };
            })
          );
        });
      break;
    case 'movies/addWatchlist': {
      db.table('movies').put({ ...action.payload, localState: 'watchlist' });
      break;
    }
    case 'movies/removeWatchlist': {
      db.table('movies').delete(action.payload.ids.trakt);
      break;
    }
    case 'shows/setWatchlist': {
      db.table('shows')
        .where('localState')
        .equals('watchlist')
        .delete()
        .then(() => {
          db.table('shows').bulkPut(
            action.payload.map((s) => ({ ...s, localState: 'watchlist' }))
          );
        });
      break;
    }
    case 'shows/addWatchlist': {
      db.table('shows').put({
        ...action.payload,
        localState: 'watchlist',
      });

      break;
    }
    case 'shows/removeWatcheds': {
      db.table('shows').bulkDelete(action.payload.map((s) => s.show.ids.trakt));
      break;
    }
    case 'shows/_removeWatched': {
      db.table('shows').delete(action.payload);
      break;
    }
    case 'shows/_removeWatchlist': {
      db.table('shows').delete(action.payload);
      break;
    }
    case 'shows/setWatched': {
      db.table('shows')
        .where('localState')
        .equals('watched')
        .delete()
        .then(() => {
          db.table('shows').bulkPut(
            action.payload.map((s) => ({ ...s, localState: 'watched' }))
          );
        });
      break;
    }
    case 'shows/addWatched': {
      db.table('shows').put({ ...action.payload, localState: 'watched' });
      break;
    }
    case 'shows/updateProgress': {
      db.table('shows')
        .where('show.ids.trakt')
        .equals(action.payload.show.show.ids.trakt)
        .modify({
          progress: action.payload.progress,
          last_watched_at: action.payload.progress.last_watched_at,
        });
      break;
    }
    case 'shows/updateSeasons': {
      db.table('shows')
        .where('show.ids.trakt')
        .equals(action.payload.show.show.ids.trakt)
        .modify({ fullSeasons: action.payload.seasons });
      break;
    }
    default:
      break;
  }
  return next(action);
};
