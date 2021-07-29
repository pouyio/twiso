import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Season, ShowProgress, ShowWatched, ShowWatchlist } from 'models';
import { mergeDeepLeft } from 'ramda';
import {
  addWatchlist,
  getShow,
  removeWatchlist,
  updateFullShow,
} from 'state/thunks/shows';

interface ShowsState {
  ready: boolean;
  watched: ShowWatched[];
  watchlist: ShowWatchlist[];
}

const initialState: ShowsState = {
  ready: true,
  watched: [],
  watchlist: [],
};

const showsSlice = createSlice({
  name: 'shows',
  initialState: initialState,
  reducers: {
    addWatchlists(state, { payload }: PayloadAction<ShowWatchlist[]>) {
      state.watchlist = [...state.watchlist, ...payload];
    },
    setWatchlist(state, { payload }: PayloadAction<ShowWatchlist[]>) {
      state.watchlist = payload;
    },
    setWatched(state, { payload }: PayloadAction<ShowWatched[]>) {
      state.watched = payload;
    },
    addWatched(state, { payload }: PayloadAction<ShowWatched>) {
      state.watched.push(payload);
    },
    updateShow(state, { payload }: PayloadAction<ShowWatched>) {
      const index = state.watched.findIndex(
        (s) => s.show.ids.trakt === payload.show.ids.trakt
      );
      state.watched[index] = mergeDeepLeft(
        payload,
        state.watched[index]
      ) as ShowWatched;
    },
    removeWatchlists(state, { payload }: PayloadAction<ShowWatchlist[]>) {
      state.watchlist = state.watchlist.filter(
        (s) => !payload.some((sd) => sd.show.ids.trakt === s.show.ids.trakt)
      );
    },
    removeWatcheds(state, { payload }: PayloadAction<ShowWatched[]>) {
      state.watched = state.watched.filter(
        (s) => !payload.some((sd) => sd.show.ids.trakt === s.show.ids.trakt)
      );
    },
    _removeWatched(state, { payload }: PayloadAction<number>) {
      state.watched = state.watched.filter((s) => payload !== s.show.ids.trakt);
    },
    updateSeasons(
      state,
      { payload }: PayloadAction<{ show: ShowWatched; seasons: Season[] }>
    ) {
      const showIndex = state.watched.findIndex(
        (s) => s.show.ids.trakt === payload.show.show.ids.trakt
      );
      if (showIndex === -1) {
        state.watched.push({ ...payload.show, fullSeasons: payload.seasons });
      } else {
        state.watched[showIndex].fullSeasons = payload.seasons;
      }
    },
    updateProgress(
      state,
      { payload }: PayloadAction<{ show: ShowWatched; progress: ShowProgress }>
    ) {
      const showIndex = state.watched.findIndex(
        (s) => s.show.ids.trakt === payload.show.show.ids.trakt
      );
      if (showIndex === -1) {
        state.watched.push({ ...payload.show, progress: payload.progress });
      } else {
        state.watched[showIndex].progress = payload.progress;
        state.watched[showIndex].last_watched_at =
          payload.progress.last_watched_at;
      }
    },
    _removeWatchlist(state, { payload }: PayloadAction<number>) {
      state.watchlist = state.watchlist.filter(
        (m) => payload !== m.show.ids.trakt
      );
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(addWatchlist.fulfilled, (state, { payload, meta }) => {
        if (payload?.added.shows) {
          state.watched = state.watched.filter(
            (m) => meta.arg.show.ids.trakt !== m.show.ids.trakt
          );
          state.watchlist.push({
            show: meta.arg.show,
            type: 'show',
            listed_at: new Date().toISOString(),
          });
        }
      })
      .addCase(removeWatchlist.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.shows) {
          state.watchlist = state.watchlist.filter(
            (s) => meta.arg.show.ids.trakt !== s.show.ids.trakt
          );
        }
      })
      .addCase(getShow.fulfilled, (state, { payload, meta }) => {
        const index = state[meta.arg.type].findIndex(
          (s) => s.show.ids.trakt === payload.ids.trakt
        );
        state[meta.arg.type][index] = {
          ...state[meta.arg.type][index],
          show: payload,
        };
      })
      .addCase(updateFullShow.fulfilled, (state, { payload }) => {
        const showIndex = state.watched.findIndex(
          (s) => s.show.ids.trakt === payload.show.ids.trakt
        );
        if (showIndex === -1) {
          state.watched.push(payload);
        } else {
          state.watched[showIndex] = payload;
        }
      }),
});

export const { _removeWatchlist, _removeWatched } = showsSlice.actions;

// actions
export const {
  setWatchlist,
  setWatched,
  addWatched,
  addWatchlists,
  updateShow,
  removeWatcheds,
  removeWatchlists,
  updateSeasons,
  updateProgress,
} = showsSlice.actions;

// reducer
export const reducer = showsSlice.reducer;
