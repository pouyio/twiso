import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeDeepLeft } from 'ramda';
import { RootState } from 'state/store';
import {
  addEpisodeWatched,
  addWatchlist,
  populateDetail,
  removeEpisodeWatched,
  removeWatchlist,
  updateFullShow,
} from './thunks';
import {
  Season,
  Show,
  ShowProgress,
  ShowWatched,
  ShowWatchlist,
} from '../../../models/Show';
import { Ids } from '../../../models/Ids';

interface ShowsState {
  totalRequestsPending: number;
  pending: {
    watchlist: string[];
    watched: string[];
    seasons: number[];
  };
  detail?: Show;
  shows: Record<number, ShowWatched | ShowWatchlist>;
  hidden: Record<number, boolean>;
}

const initialState: ShowsState = {
  totalRequestsPending: 0,
  pending: {
    watchlist: [],
    watched: [],
    seasons: [],
  },
  shows: {},
  hidden: {},
};

const showsSlice = createSlice({
  name: 'shows',
  initialState: initialState,
  reducers: {
    set(state, { payload }: PayloadAction<Array<ShowWatchlist | ShowWatched>>) {
      payload.forEach((show) => {
        state.shows[show.show.ids.trakt] = show;
      });
    },
    setHidden(state, { payload }: PayloadAction<Array<Ids>>) {
      payload.forEach((ids) => {
        state.hidden = {};
        state.hidden[ids.trakt] = true;
      });
    },
    updateHidden(state, { payload }: PayloadAction<Array<Ids>>) {
      payload.forEach((ids) => {
        state.hidden = {};
        state.hidden[ids.trakt] = true;
      });
    },
    addWatched(state, { payload }: PayloadAction<ShowWatched>) {
      state.shows[payload.show.ids.trakt] = payload;
    },
    updateShow(state, { payload }: PayloadAction<ShowWatched>) {
      state.shows[payload.show.ids.trakt] = mergeDeepLeft(
        payload,
        state.shows[payload.show.ids.trakt]
      ) as ShowWatched;
    },
    remove(
      state,
      { payload }: PayloadAction<Array<ShowWatchlist | ShowWatched>>
    ) {
      payload.forEach((show) => {
        delete state.shows[show.show.ids.trakt];
      });
    },
    updateSeasons(
      state,
      { payload }: PayloadAction<{ show: ShowWatched; seasons: Season[] }>
    ) {
      const storedShow = state.shows[payload.show.show.ids.trakt];
      state.shows[payload.show.show.ids.trakt] = {
        ...(storedShow || payload.show),
        fullSeasons: payload.seasons,
      } as ShowWatched;
    },
    updateProgress(
      state,
      { payload }: PayloadAction<{ show: ShowWatched; progress: ShowProgress }>
    ) {
      const storedShow = state.shows[payload.show.show.ids.trakt];
      state.shows[payload.show.show.ids.trakt] = {
        ...(storedShow || payload.show),
        progress: payload.progress,
        last_watched_at: payload.progress.last_watched_at,
      } as ShowWatched;
    },
    updateTranslation(
      state,
      {
        payload,
      }: PayloadAction<{
        translation: { title: string; overview: string };
        id: number;
      }>
    ) {
      const storedShow = state.shows[payload.id];
      if (storedShow) {
        storedShow.show.title = payload.translation.title;
        storedShow.show.overview = payload.translation.overview;
      }
    },
  },
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
      .addCase(removeWatchlist.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.shows) {
          delete state.shows[meta.arg.show.ids.trakt];
        }
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.imdb
        );
      })
      .addCase(removeWatchlist.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.show.ids.imdb
        );
      })
      .addCase(updateFullShow.pending, (state) => {
        state.totalRequestsPending = state.totalRequestsPending + 1;
      })
      .addCase(updateFullShow.rejected, (state) => {
        state.totalRequestsPending = state.totalRequestsPending - 1;
      })
      .addCase(updateFullShow.fulfilled, (state, { payload }) => {
        state.shows[payload.show.ids.trakt] = {
          ...state.shows[payload.show.ids.trakt],
          ...payload,
        };
        state.totalRequestsPending = state.totalRequestsPending - 1;
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
  set,
  setHidden,
  updateHidden,
  addWatched,
  updateShow,
  updateSeasons,
  updateProgress,
  remove,
  updateTranslation,
} = showsSlice.actions;

// reducer
export const reducer = showsSlice.reducer;

// selectors
const showsSelector = (state: RootState) => state.shows.shows;
export const byType = createSelector(showsSelector, (shows) => {
  return Object.values(shows).reduce<{
    watchlist: ShowWatchlist[];
    watched: ShowWatched[];
  }>(
    (
      acc: {
        watchlist: ShowWatchlist[];
        watched: ShowWatched[];
      },
      s
    ) => {
      acc[s.localState].push(s as any);
      return acc;
    },
    { watchlist: [], watched: [] }
  );
});

export const totalByType = createSelector(byType, ({ watchlist, watched }) => {
  return { watchlist: watchlist.length, watched: watched.length };
});
