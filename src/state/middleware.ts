import { Middleware } from '@reduxjs/toolkit';
import db from '../utils/db';

const MOVIES = 'movies';
const SHOWS = 'shows';

export const dbMiddleware: Middleware = (store) => (next) => (action) => {
  switch (action.type) {
    case 'movies/addWatched/fulfilled': {
      if (action.payload.added.movies) {
        db.table(MOVIES).put({
          movie: action.meta.arg.movie,
          localState: 'watched',
        });
      }
      break;
    }
    case 'movies/removeWatched/fulfilled':
    case 'movies/removeWatchlist/fulfilled': {
      if (action.payload.deleted.movies) {
        db.table(MOVIES).delete(action.meta.arg.movie.ids.trakt);
      }
      break;
    }
    case 'movies/addWatchlist/fulfilled': {
      if (action.payload.added.movies) {
        db.table(MOVIES).put({
          movie: action.meta.arg.movie,
          localState: 'watchlist',
        });
      }
      break;
    }
    case 'movies/removeWatchlists': {
      db.table(MOVIES).bulkDelete(action.payload.map((m) => m.movie.ids.trakt));
      break;
    }
    case 'movies/getMovie/fulfilled': {
      const state = store.getState().movies;
      const oldMovie = state[action.meta.arg.type].find(
        (m) => m.movie.ids.trakt === action.meta.arg.id
      );
      const newMovie = { ...oldMovie, movie: action.payload };
      db.table(MOVIES).put({ ...newMovie, localState: action.meta.arg.type });
      break;
    }
    case 'shows/removeWatchlists': {
      db.table(SHOWS).bulkDelete(action.payload.map((s) => s.show.ids.trakt));
      break;
    }
    case 'shows/addWatchlist/fulfilled': {
      if (action.payload.added.shows) {
        db.table(SHOWS).put({
          show: action.meta.arg.show,
          localState: 'watchlist',
        });
      }
      break;
    }
    case 'shows/removeWatcheds': {
      db.table(SHOWS).bulkDelete(action.payload.map((s) => s.show.ids.trakt));
      break;
    }
    case 'shows/removeWatchlist/fulfilled': {
      if (action.payload.deleted.shows) {
        db.table(SHOWS).delete(action.meta.arg.show.ids.trakt);
      }
      break;
    }
    case 'shows/updateShow': {
      db.table(SHOWS).update(action.payload.show.ids.trakt, {
        ...action.payload,
      });
      break;
    }
    case 'shows/addWatched': {
      db.table(SHOWS).put({ ...action.payload, localState: 'watched' });
      break;
    }
    case 'shows/updateProgress': {
      db.table(SHOWS).update(action.payload.show.show.ids.trakt, {
        progress: action.payload.progress,
        last_watched_at: action.payload.progress.last_watched_at,
      });
      break;
    }
    case 'shows/updateSeasons': {
      db.table(SHOWS).update(action.payload.show.show.ids.trakt, {
        fullSeasons: action.payload.seasons,
      });
      break;
    }
    case 'shows/getShow/fulfilled': {
      const state = store.getState().shows;
      const oldShow = state[action.meta.arg.type].find(
        (s) => s.show.ids.trakt === action.meta.arg.id
      );
      const newShow = { ...oldShow, show: action.payload };
      db.table(SHOWS).put({ ...newShow, localState: action.meta.arg.type });
      break;
    }
    case 'shows/updateFullShow/fulfilled': {
      db.table(SHOWS).update(
        action.meta.arg.outdated.show.ids.trakt,
        action.payload
      );
      break;
    }
    case 'shows/addEpisodeWatched/fulfilled':
    case 'shows/addSeasonWatched/fulfilled': {
      db.table(SHOWS).put({
        ...action.payload,
        localState: 'watched',
      });
      break;
    }
    case 'shows/removeEpisodeWatched/fulfilled':
    case 'shows/removeSeasonWatched/fulfilled': {
      if (action.payload) {
        db.table(SHOWS).update(action.meta.arg.show.show.ids.trakt, {
          progress: action.payload,
          last_watched_at: action.payload.last_watched_at,
        });
      } else {
        db.table(SHOWS).delete(action.meta.arg.show.show.ids.trakt);
      }
      break;
    }
    case 'config/setLanguage': {
      localStorage.setItem('language', action.payload);
      break;
    }
    default:
      break;
  }
  return next(action);
};
