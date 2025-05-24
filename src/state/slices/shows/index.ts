import { createSlice } from '@reduxjs/toolkit';
import {
  addEpisodeWatched,
  addWatchlist,
  fillDetail,
  removeEpisodeWatched,
  removeWatchlist,
} from './thunks';

interface ShowsState {
  totalRequestsPending: number;
  pending: {
    watchlist: string[];
    watched: string[];
  };
}

const initialState: ShowsState = {
  totalRequestsPending: 0,
  pending: {
    watchlist: [],
    watched: [],
  },
};

const showsSlice = createSlice({
  name: 'shows',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWatchlist.pending, (state, { meta }) => {
        state.pending.watchlist.push(meta.arg.show.ids.imdb);
      })
      .addCase(addWatchlist.fulfilled, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.imdb
        );
      })
      .addCase(addWatchlist.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.imdb
        );
      })
      .addCase(removeWatchlist.pending, (state, { meta }) => {
        state.pending.watchlist.push(meta.arg.show.ids.imdb);
      })
      .addCase(removeWatchlist.fulfilled, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.imdb
        );
      })
      .addCase(removeWatchlist.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.imdb
        );
      })
      .addCase(addEpisodeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(...meta.arg.episodes.map((e) => e.ids.imdb));
      })
      .addCase(addEpisodeWatched.fulfilled, (state, { meta }) => {
        const addedEpisodes = meta.arg.episodes.map((e) => e.ids.imdb);
        state.pending.watched = state.pending.watched.filter(
          (p) => !addedEpisodes.includes(p)
        );
      })
      .addCase(addEpisodeWatched.rejected, (state, { meta }) => {
        const addedEpisodes = meta.arg.episodes.map((e) => e.ids.imdb);
        state.pending.watched = state.pending.watched.filter(
          (p) => !addedEpisodes.includes(p)
        );
      })
      .addCase(removeEpisodeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(...meta.arg.episodes.map((e) => e.imdb));
      })
      .addCase(removeEpisodeWatched.fulfilled, (state, { meta }) => {
        const removedEpisodes = meta.arg.episodes.map((e) => e.imdb);
        state.pending.watched = state.pending.watched.filter(
          (p) => !removedEpisodes.includes(p)
        );
      })
      .addCase(removeEpisodeWatched.rejected, (state, { meta }) => {
        const removedEpisodes = meta.arg.episodes.map((e) => e.imdb);
        state.pending.watched = state.pending.watched.filter(
          (p) => !removedEpisodes.includes(p)
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

// actions
export const {} = showsSlice.actions;

// reducer
export const reducer = showsSlice.reducer;

// selectors
