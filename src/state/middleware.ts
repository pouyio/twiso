import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import db from '../utils/db';
import {
  addWatched as addWatchedMovie,
  addWatchlist as AddWatchlistMovie,
  getMovie,
  removeWatched,
  removeWatchlist as removeWatchlistMovie,
} from './slices/movies/thunks';
import {
  remove as removeMovie,
  updateTranslation as updateTranslationMovie,
} from './slices/movies';
import {
  remove as removeShow,
  updateShow,
  addWatched as addWatchedShow,
  updateProgress,
  updateTranslation as updateTranslationShow,
  updateSeasons,
} from './slices/shows';
import {
  addEpisodeWatched,
  addSeasonWatched,
  addWatchlist as addWatchlistShow,
  removeEpisodeWatched,
  removeSeasonWatched,
  removeWatchlist as removeWatchlistShow,
  updateFullShow,
} from './slices/shows/thunks';
import { changeLanguage } from './slices/config';

const MOVIES = 'movies';
const SHOWS = 'shows';

export const dbMiddleware: Middleware = (store) => (next) => (action) => {
  if (isAnyOf(addWatchedMovie.fulfilled)(action)) {
    db.table(MOVIES).put({
      movie: action.meta.arg.movie,
      watched_at: action.payload.watched_at,
      localState: 'watched',
    });
  } else if (
    isAnyOf(removeWatched.fulfilled, removeWatchlistMovie.fulfilled)(action)
  ) {
    if (action.payload.deleted.movies) {
      db.table(MOVIES).delete(action.meta.arg.movie.ids.trakt);
    }
  } else if (isAnyOf(AddWatchlistMovie.fulfilled)(action)) {
    if (action.payload.added.movies) {
      db.table(MOVIES).put({
        movie: action.meta.arg.movie,
        listed_at: action.payload.listed_at,
        localState: 'watchlist',
      });
    }
  } else if (isAnyOf(removeMovie)(action)) {
    db.table(MOVIES).bulkDelete(action.payload.map((m) => m.movie.ids.trakt));
  } else if (isAnyOf(getMovie.fulfilled)(action)) {
    const state = store.getState().movies;
    const oldMovie = state.movies[action.meta.arg.id];
    const newMovie = { ...oldMovie, movie: action.payload };
    db.table(MOVIES).put({ ...newMovie, localState: action.meta.arg.type });
  } else if (isAnyOf(updateTranslationMovie)(action)) {
    db.table(MOVIES).update(action.payload.id, {
      title: action.payload.translation.title,
      overview: action.payload.translation.overview,
    });
  } else if (isAnyOf(removeShow)(action)) {
    db.table(SHOWS).bulkDelete(action.payload.map((s) => s.show.ids.trakt));
  } else if (isAnyOf(addWatchlistShow.fulfilled)(action)) {
    if (action.payload.added.shows) {
      db.table(SHOWS).put({
        show: action.meta.arg.show,
        listed_at: action.payload.listed_at,
        localState: 'watchlist',
      });
    }
  } else if (isAnyOf(removeWatchlistShow.fulfilled)(action)) {
    if (action.payload.deleted.shows) {
      db.table(SHOWS).delete(action.meta.arg.show.ids.trakt);
    }
  } else if (isAnyOf(updateShow)(action)) {
    db.table(SHOWS).update(action.payload.show.ids.trakt, {
      ...action.payload,
    });
  } else if (isAnyOf(addWatchedShow)(action)) {
    db.table(SHOWS).put({ ...action.payload, localState: 'watched' });
  } else if (isAnyOf(updateProgress)(action)) {
    db.table(SHOWS).update(action.payload.show.show.ids.trakt, {
      progress: action.payload.progress,
      last_watched_at: action.payload.progress.last_watched_at,
    });
  } else if (isAnyOf(updateSeasons)(action)) {
    db.table(SHOWS).update(action.payload.show.show.ids.trakt, {
      fullSeasons: action.payload.seasons,
    });
  } else if (isAnyOf(updateFullShow.fulfilled)(action)) {
    db.table(SHOWS).put(action.payload);
  } else if (
    isAnyOf(addEpisodeWatched.fulfilled, addSeasonWatched.fulfilled)(action)
  ) {
    db.table(SHOWS).put({
      ...action.payload,
      localState: 'watched',
    });
  } else if (
    isAnyOf(
      removeEpisodeWatched.fulfilled,
      removeSeasonWatched.fulfilled
    )(action)
  ) {
    if (action.payload) {
      db.table(SHOWS).update(action.meta.arg.show.show.ids.trakt, {
        progress: action.payload,
        last_watched_at: action.payload.last_watched_at,
      });
    } else {
      db.table(SHOWS).delete(action.meta.arg.show.show.ids.trakt);
    }
  } else if (isAnyOf(updateTranslationShow)(action)) {
    db.table(SHOWS).update(action.payload.id, {
      title: action.payload.translation.title,
      overview: action.payload.translation.overview,
    });
  } else if (isAnyOf(changeLanguage.fulfilled)(action)) {
    localStorage.setItem('language', action.meta.arg.language);
  }

  return next(action);
};
