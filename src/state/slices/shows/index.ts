import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Season, Show, ShowProgress, ShowWatched, ShowWatchlist } from 'models';
import { mergeDeepLeft } from 'ramda';
import {
  addEpisodeWatched,
  addSeasonWatched,
  addWatchlist,
  getShow,
  populateDetail,
  removeEpisodeWatched,
  removeSeasonWatched,
  removeWatchlist,
  updateFullShow,
} from './thunks';

interface ShowsState {
  ready: boolean;
  pending: {
    watchlist: number[];
    watched: number[];
    seasons: number[];
  };
  watched: ShowWatched[];
  watchlist: ShowWatchlist[];
  detail?: Show;
}

const initialState: ShowsState = {
  ready: true,
  pending: {
    watchlist: [],
    watched: [],
    seasons: [],
  },
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWatchlist.pending, (state, { meta }) => {
        state.pending.watchlist.push(meta.arg.show.ids.trakt);
      })
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
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.trakt
        );
      })
      .addCase(addWatchlist.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.trakt
        );
      })
      .addCase(removeWatchlist.pending, (state, { meta }) => {
        state.pending.watchlist.push(meta.arg.show.ids.trakt);
      })
      .addCase(removeWatchlist.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.shows) {
          state.watchlist = state.watchlist.filter(
            (s) => meta.arg.show.ids.trakt !== s.show.ids.trakt
          );
        }
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.trakt
        );
      })
      .addCase(removeWatchlist.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.trakt
        );
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
      })
      .addCase(addEpisodeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(meta.arg.episode.ids.trakt);
      })
      .addCase(addEpisodeWatched.fulfilled, (state, { meta, payload }) => {
        state.watchlist = state.watchlist.filter(
          (m) => meta.arg.show.show.ids.trakt !== m.show.ids.trakt
        );
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.episode.ids.trakt
        );
        const showIndex = state.watched.findIndex(
          (s) => s.show.ids.trakt === payload.show.ids.trakt
        );
        if (showIndex === -1) {
          state.watched.push(payload);
        } else {
          state.watched[showIndex] = payload;
        }
      })
      .addCase(addEpisodeWatched.rejected, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.episode.ids.trakt
        );
      })
      .addCase(addSeasonWatched.pending, (state, { meta }) => {
        state.pending.seasons.push(meta.arg.season.ids.trakt);
      })
      .addCase(addSeasonWatched.fulfilled, (state, { meta, payload }) => {
        state.watchlist = state.watchlist.filter(
          (m) => meta.arg.show.show.ids.trakt !== m.show.ids.trakt
        );
        state.pending.seasons = state.pending.seasons.filter(
          (p) => p !== meta.arg.season.ids.trakt
        );
        const showIndex = state.watched.findIndex(
          (s) => s.show.ids.trakt === payload.show.ids.trakt
        );
        if (showIndex === -1) {
          state.watched.push(payload);
        } else {
          state.watched[showIndex] = payload;
        }
      })
      .addCase(addSeasonWatched.rejected, (state, { meta }) => {
        state.pending.seasons = state.pending.seasons.filter(
          (p) => p !== meta.arg.season.ids.trakt
        );
      })
      .addCase(removeEpisodeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(meta.arg.episode.ids.trakt);
      })
      .addCase(removeEpisodeWatched.fulfilled, (state, { meta, payload }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.episode.ids.trakt
        );
        if (payload) {
          const showIndex = state.watched.findIndex(
            (s) => s.show.ids.trakt === meta.arg.show.show.ids.trakt
          );
          state.watched[showIndex].progress = payload;
          state.watched[showIndex].last_watched_at = payload.last_watched_at;
        } else {
          state.watched = state.watched.filter(
            (s) => s.show.ids.trakt !== meta.arg.show.show.ids.trakt
          );
        }
      })
      .addCase(removeEpisodeWatched.rejected, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.episode.ids.trakt
        );
      })
      .addCase(removeSeasonWatched.pending, (state, { meta }) => {
        state.pending.seasons.push(meta.arg.season.ids.trakt);
      })
      .addCase(removeSeasonWatched.fulfilled, (state, { meta, payload }) => {
        state.pending.seasons = state.pending.seasons.filter(
          (p) => p !== meta.arg.season.ids.trakt
        );
        if (payload) {
          const showIndex = state.watched.findIndex(
            (s) => s.show.ids.trakt === meta.arg.show.show.ids.trakt
          );
          state.watched[showIndex].progress = payload;
          state.watched[showIndex].last_watched_at = payload.last_watched_at;
        } else {
          state.watched = state.watched.filter(
            (s) => s.show.ids.trakt !== meta.arg.show.show.ids.trakt
          );
        }
      })
      .addCase(removeSeasonWatched.rejected, (state, { meta }) => {
        state.pending.seasons = state.pending.seasons.filter(
          (p) => p !== meta.arg.season.ids.trakt
        );
      })
      .addCase(populateDetail.pending, (state) => {
        state.detail = undefined;
      })
      .addCase(populateDetail.fulfilled, (state, { payload }) => {
        state.detail = payload;
      })
      .addCase(populateDetail.rejected, (state) => {
        state.detail = undefined;
      });
  },
});

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
