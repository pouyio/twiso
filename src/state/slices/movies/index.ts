import { createSlice } from '@reduxjs/toolkit';
import {
  addWatched,
  fillDetail,
  removeWatched,
} from 'state/slices/movies/thunks';

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
      .addCase(addWatched.pending, (state, { meta }) => {
        state.pending.watched.push(meta.arg.movie.ids.imdb);
      })
      .addCase(addWatched.fulfilled, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.imdb
        );
      })
      .addCase(addWatched.rejected, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.imdb
        );
      })
      .addCase(removeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(meta.arg.movie.ids.imdb);
      })
      .addCase(removeWatched.fulfilled, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.imdb
        );
      })
      .addCase(removeWatched.rejected, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.imdb
        );
      })
      .addCase(fillDetail.pending, (state) => {
        state.totalRequestsPending = state.totalRequestsPending + 1;
      })
      .addCase(fillDetail.fulfilled, (state) => {
        state.totalRequestsPending = state.totalRequestsPending - 1;
      })
      .addCase(fillDetail.rejected, (state) => {
        state.totalRequestsPending = state.totalRequestsPending - 1;
      });
  },
});

// reducer
export const reducer = moviesSlice.reducer;
