import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addWatchedMovie,
  addWatchlist,
  fillDetail,
  removeWatched,
  removeWatchlist,
} from '../../../state/slices/movies/thunks';

interface MoviesState {
  totalRequestsPending: number;
  pending: { watched: string[]; watchlist: string[] };
}

const initialState: MoviesState = {
  totalRequestsPending: 0,
  pending: {
    watched: [],
    watchlist: [],
  },
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fillDetail.pending, (state) => {
        state.totalRequestsPending = state.totalRequestsPending + 1;
      })
      .addMatcher(
        isAnyOf(addWatchedMovie.pending, removeWatched.pending),
        (state, { meta }) => {
          state.pending.watched.push(meta.arg.movie.ids.imdb);
        }
      )
      .addMatcher(
        isAnyOf(
          addWatchedMovie.fulfilled,
          addWatchedMovie.rejected,
          removeWatched.fulfilled,
          removeWatched.rejected
        ),
        (state, { meta }) => {
          state.pending.watched = state.pending.watched.filter(
            (p) => p !== meta.arg.movie.ids.imdb
          );
        }
      )
      .addMatcher(
        isAnyOf(addWatchlist.pending, removeWatchlist.pending),
        (state, { meta }) => {
          state.pending.watchlist.push(meta.arg.movie.ids.imdb);
        }
      )
      .addMatcher(
        isAnyOf(
          addWatchlist.fulfilled,
          addWatchlist.rejected,
          removeWatchlist.rejected,
          removeWatchlist.fulfilled
        ),
        (state, { meta }) => {
          state.pending.watchlist = state.pending.watched.filter(
            (p) => p !== meta.arg.movie.ids.imdb
          );
        }
      )
      .addMatcher(
        isAnyOf(fillDetail.fulfilled, fillDetail.rejected),
        (state) => {
          state.totalRequestsPending = state.totalRequestsPending - 1;
        }
      );
  },
});

// actions
export const {} = moviesSlice.actions;

// reducer
export const reducer = moviesSlice.reducer;
