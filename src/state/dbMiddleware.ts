import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import db, {
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from '../utils/db';
import {
  addWatched as addWatchedMovie,
  addWatchlist as addWatchlistMovie,
  fillDetail,
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
  updateHidden,
} from './slices/shows';
import {
  addEpisodeWatched,
  addSeasonWatched,
  addWatchlist as addWatchlistShow,
  removeEpisodeWatched,
  removeSeasonWatched,
  removeWatchlist as removeWatchlistShow,
  toggleHidden,
  updateFullShow,
  fillDetail as fillDetailShow,
} from './slices/shows/thunks';
import { changeLanguage } from './slices/config';

export const dbMiddleware: Middleware = (_store) => (next) => (action) => {
  if (isAnyOf(fillDetail.fulfilled)(action)) {
    db.table(DETAIL_MOVIES_TABLE).put(action.payload);
  } else if (
    isAnyOf(removeWatched.fulfilled, removeWatchlistMovie.fulfilled)(action)
  ) {
    if (action.payload.deleted.movies) {
      if (action.meta.arg.movie.ids.imdb) {
        db.table(USER_MOVIES_TABLE).delete(action.meta.arg.movie.ids.imdb);
      }
    }
  } else if (isAnyOf(addWatchlistMovie.fulfilled)(action)) {
    if (action.payload.added.movies) {
      db.table(USER_MOVIES_TABLE).put({
        movie: action.payload.added.movies[0],
        added_to_watchlist_at: new Date().toISOString(),
        status: 'plantowatch',
      });
    }
  } else if (isAnyOf(addWatchedMovie.fulfilled)(action)) {
    if (action.payload.added.movies) {
      db.table(USER_MOVIES_TABLE).put({
        movie: action.payload.added.statuses[0].request,
        last_watched_at: new Date().toISOString(),
        status: 'completed',
      });
    }
  } else if (isAnyOf(fillDetailShow.fulfilled)(action)) {
    db.table(DETAIL_SHOWS_TABLE).put(action.payload);
  } else if (isAnyOf(addWatchlistShow.fulfilled)(action)) {
    if (action.payload.added.shows) {
      db.table(USER_SHOWS_TABLE).put({
        show: action.payload.added.shows[0],
        added_to_watchlist_at: new Date().toISOString(),
        status: 'plantowatch',
      });
    }
  } else if (isAnyOf(removeWatchlistShow.fulfilled)(action)) {
    if (action.payload.deleted.shows) {
      if (action.meta.arg.show.ids.imdb) {
        db.table(USER_SHOWS_TABLE).delete(action.meta.arg.show.ids.imdb);
      }
    }
  }

  return next(action);
};
