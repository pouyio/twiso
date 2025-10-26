import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addEpisodeWatched,
  addWatchlist,
  fillDetail,
  removeEpisodeWatched,
  removeWatchlist,
  setHiddenShow,
} from './thunks';

interface ShowsState {
  totalRequestsPending: number;
  pending: {
    watchlist: string[];
    watched: Array<{
      showId: string;
      season: number;
      episode: number;
    }>;
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
      .addCase(addEpisodeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(
          ...meta.arg.episodes.map((e) => ({
            showId: meta.arg.showIds.imdb,
            season: e.season,
            episode: e.number,
          }))
        );
      })
      .addCase(removeEpisodeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(
          ...meta.arg.episodes.map((e) => ({
            showId: meta.arg.showIds.imdb,
            season: e.season,
            episode: e.number,
          }))
        );
      })
      .addMatcher(
        isAnyOf(removeWatchlist.pending, addWatchlist.pending),
        (state, { meta }) => {
          state.pending.watchlist.push(meta.arg.show.ids.imdb);
        }
      )
      .addMatcher(
        isAnyOf(
          addWatchlist.rejected,
          addWatchlist.fulfilled,
          removeWatchlist.rejected,
          removeWatchlist.fulfilled
        ),
        (state, { meta }) => {
          state.pending.watchlist = state.pending.watchlist.filter(
            (p) => p !== meta.arg.show.ids.imdb
          );
        }
      )
      .addMatcher(
        isAnyOf(
          addEpisodeWatched.rejected,
          addEpisodeWatched.fulfilled,
          removeEpisodeWatched.rejected,
          removeEpisodeWatched.fulfilled
        ),
        (state, { meta }) => {
          state.pending.watched = state.pending.watched.filter(
            (p) =>
              !meta.arg.episodes.find(
                (me) =>
                  me.number === p.episode &&
                  me.season === p.season &&
                  meta.arg.showIds.imdb === p.showId
              )
          );
        }
      )
      .addMatcher(
        isAnyOf(fillDetail.pending, setHiddenShow.pending),
        (state) => {
          state.totalRequestsPending = state.totalRequestsPending + 1;
        }
      )
      .addMatcher(
        isAnyOf(
          fillDetail.rejected,
          setHiddenShow.rejected,
          fillDetail.fulfilled,
          setHiddenShow.fulfilled
        ),
        (state) => {
          state.totalRequestsPending = state.totalRequestsPending - 1;
        }
      );
  },
});

// actions
export const {} = showsSlice.actions;

// reducer
export const reducer = showsSlice.reducer;

// selectors
