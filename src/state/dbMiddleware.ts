import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import db, {
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from '../utils/db';
import {
  addWatchedMovie,
  addWatchlist as addWatchlistMovie,
  fillDetail,
  removeWatched,
  removeWatchlist as removeWatchlistMovie,
} from './slices/movies/thunks';
import {
  addWatchlist as addWatchlistShow,
  removeWatchlist as removeWatchlistShow,
  fillDetail as fillDetailShow,
} from './slices/shows/thunks';

export const dbMiddleware: Middleware = (_store) => (next) => (action) => {
  if (isAnyOf(fillDetail.fulfilled)(action)) {
    db[DETAIL_MOVIES_TABLE].put(action.payload);
  } else if (
    isAnyOf(removeWatched.fulfilled, removeWatchlistMovie.fulfilled)(action)
  ) {
    db[USER_MOVIES_TABLE].delete(action.meta.arg.movie.ids.imdb);
  } else if (isAnyOf(addWatchlistMovie.fulfilled)(action) && action.payload) {
    db[USER_MOVIES_TABLE].put(action.payload);
  } else if (isAnyOf(addWatchedMovie.fulfilled)(action) && action.payload) {
    db[USER_MOVIES_TABLE].put(action.payload);
  } else if (isAnyOf(fillDetailShow.fulfilled)(action)) {
    db[DETAIL_SHOWS_TABLE].put(action.payload);
  } else if (isAnyOf(addWatchlistShow.fulfilled)(action) && action.payload) {
    db[USER_SHOWS_TABLE].put(action.payload);
  } else if (isAnyOf(removeWatchlistShow.fulfilled)(action)) {
    db[USER_SHOWS_TABLE].delete(action.meta.arg.show.ids.imdb);
  }

  return next(action);
};
