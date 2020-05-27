import { Action } from './action';
import { MiddlewareApi } from './store';
import db from '../utils/db';

export const customMiddleware = (store: MiddlewareApi) => (
  next: (action: Action) => void
) => (action: Action) => {
  next(action);
  switch (action.type) {
    case 'SET_WATCHED_MOVIES': {
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
    case 'ADD_WATCHED_MOVIE': {
      db.table('movies').put({ ...action.payload, localState: 'watched' });
      break;
    }
    case 'REMOVE_WATCHED_MOVIE': {
      db.table('movies').delete(action.payload.ids.trakt);
      break;
    }
    case 'SET_WATCHLIST_MOVIES': {
      db.table('movies')
        .where('localState')
        .equals('watchlist')
        .delete()
        .then(() => {
          db.table('movies').bulkPut(
            action.payload.map((m) => ({ ...m, localState: 'watchlist' }))
          );
        });
      break;
    }
    case 'ADD_WATCHLIST_MOVIE': {
      db.table('movies').put({ ...action.payload, localState: 'watchlist' });
      break;
    }
    case 'REMOVE_WATCHLIST_MOVIE': {
      db.table('movies').delete(action.payload.ids.trakt);
      break;
    }
    case 'SET_WATCHLIST_SHOWS': {
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
    case 'ADD_WATCHLIST_SHOW': {
      db.table('shows').put({ ...action.payload, localState: 'watchlist' });
      break;
    }
    case 'REMOVE_WATCHED_SHOW': {
      db.table('shows').delete(action.payload.ids.trakt);
      break;
    }
    case 'REMOVE_WATCHED_SHOWS': {
      db.table('shows').bulkDelete(action.payload.map((s) => s.show.ids.trakt));
      break;
    }
    case 'REMOVE_WATCHLIST_SHOW': {
      db.table('shows').delete(action.payload.ids.trakt);
      break;
    }
    case 'SET_WATCHED_SHOWS': {
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
    case 'ADD_WATCHED_SHOW': {
      db.table('shows').put({ ...action.payload, localState: 'watched' });
      break;
    }
    case 'UPDATE_SHOW_PROGRESS': {
      db.table('shows')
        .where('show.ids.trakt')
        .equals(action.payload.show.show.ids.trakt)
        .modify({ progress: action.payload.progress });
      break;
    }
    case 'UPDATE_SHOW_SEASONS': {
      db.table('shows')
        .where('show.ids.trakt')
        .equals(action.payload.show.show.ids.trakt)
        .modify({ fullSeasons: action.payload.seasons });
      break;
    }
  }
};
