import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from '../state';
import { MovieWatchlist, MovieWatched, Movie } from 'models';
import {
  addWatchedApi,
  removeWatchedApi,
  removeWatchlistApi,
  addWatchlistApi,
} from 'utils/api';

export const addWatched = createAsyncThunk(
  'movies/addWatched',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await addWatchedApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatched = createAsyncThunk(
  'movies/removeWatched',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await removeWatchedApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const addWatchlist = createAsyncThunk(
  'movies/addWatchlist',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await addWatchlistApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk(
  'movies/removeWatchlist',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await removeWatchlistApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: initialState.movies,
  reducers: {
    setWatched(state, { payload }: PayloadAction<MovieWatched[]>) {
      state.watched = payload;
    },
    setWatchlist(state, { payload }: PayloadAction<MovieWatchlist[]>) {
      state.watchlist = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(addWatched.fulfilled, (state, { payload, meta }) => {
        if (payload?.added.movies) {
          state.watchlist = state.watchlist.filter(
            (m) => meta.arg.movie.ids.trakt !== m.movie.ids.trakt
          );
          state.watched.push({
            movie: meta.arg.movie,
            type: 'movie',
            watched_at: new Date().toISOString(),
          });
        }
      })
      .addCase(removeWatched.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.movies) {
          state.watched = state.watched.filter(
            (m) => meta.arg.movie.ids.trakt !== m.movie.ids.trakt
          );
        }
      })
      .addCase(addWatchlist.fulfilled, (state, { payload, meta }) => {
        if (payload?.added.movies) {
          state.watched = state.watched.filter(
            (m) => meta.arg.movie.ids.trakt !== m.movie.ids.trakt
          );
          state.watchlist.push({
            movie: meta.arg.movie,
            type: 'movie',
            listed_at: new Date().toISOString(),
          });
        }
      })
      .addCase(removeWatchlist.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.movies) {
          state.watchlist = state.watchlist.filter(
            (m) => meta.arg.movie.ids.trakt !== m.movie.ids.trakt
          );
        }
      }),
});

export const { setWatched, setWatchlist } = moviesSlice.actions;

export const reducer = moviesSlice.reducer;
