import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IState } from '../state';
import { MovieWatchlist, MovieWatched } from 'models';
import {
  addWatched,
  addWatchlist as addWatchlistThunk,
  getMovie,
  removeWatched,
  removeWatchlist as removeWatchlistThunk,
} from 'state/thunks/movies';

interface MoviesState {
  ready: boolean;
  watched: MovieWatched[];
  watchlist: MovieWatchlist[];
}

const initialState: MoviesState = {
  ready: true,
  watched: [],
  watchlist: [],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState: initialState,
  reducers: {
    setWatched(state, { payload }: PayloadAction<MovieWatched[]>) {
      state.watched = payload;
    },
    setWatchlist(state, { payload }: PayloadAction<MovieWatchlist[]>) {
      state.watchlist = payload;
    },
    addWatchlists(state, { payload }: PayloadAction<MovieWatchlist[]>) {
      state.watchlist = [...state.watchlist, ...payload];
    },
    addWatcheds(state, { payload }: PayloadAction<MovieWatched[]>) {
      state.watched = [...state.watched, ...payload];
    },
    removeWatchlists(state, { payload }: PayloadAction<MovieWatchlist[]>) {
      state.watchlist = state.watchlist.filter(
        (m) => !payload.some((md) => md.movie.ids.trakt === m.movie.ids.trakt)
      );
    },
    removeWatcheds(state, { payload }: PayloadAction<MovieWatched[]>) {
      state.watched = state.watched.filter(
        (m) => !payload.some((md) => md.movie.ids.trakt === m.movie.ids.trakt)
      );
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
      .addCase(addWatchlistThunk.fulfilled, (state, { payload, meta }) => {
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
      .addCase(removeWatchlistThunk.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.movies) {
          state.watchlist = state.watchlist.filter(
            (m) => meta.arg.movie.ids.trakt !== m.movie.ids.trakt
          );
        }
      })
      .addCase(getMovie.fulfilled, (state, { payload, meta }) => {
        const index = state.watchlist.findIndex(
          (m) => m.movie.ids.trakt === payload.ids.trakt
        );
        state.watchlist[index] = { ...state.watchlist[index], movie: payload };
      }),
});

// actions
export const {
  setWatched,
  setWatchlist,
  addWatchlists,
  addWatcheds,
  removeWatchlists,
  removeWatcheds,
} = moviesSlice.actions;

// reducer
export const reducer = moviesSlice.reducer;

// selectors
export const allMovies = (state: IState) => [
  ...state.movies.watched,
  ...state.movies.watchlist,
];
