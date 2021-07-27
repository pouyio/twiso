import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ShowWatchlist,
  ShowWatched,
  Show,
  Season,
  ShowProgress,
  Episode,
} from 'models';
import {
  addWatchlistApi,
  removeWatchlistApi,
  getProgressApi,
  addWatchedApi,
  removeWatchedApi,
} from 'utils/api';
import { mergeDeepLeft } from 'ramda';

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

export const addWatchlist = createAsyncThunk(
  'shows/addWatchlist',
  async ({ show }: { show: Show }) => {
    try {
      const { data } = await addWatchlistApi(show, 'show');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk(
  'shows/removeWatchlist',
  async ({ show }: { show: Show }, { dispatch }) => {
    try {
      const { data } = await removeWatchlistApi(show, 'show');
      if (data.deleted.shows) {
        dispatch(_removeWatchlist(show.ids.trakt));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const addEpisodeWatched = createAsyncThunk(
  'shows/addEpisodeWatched',
  async (
    {
      show,
      episode,
    }: {
      show: ShowWatched;
      episode: Episode;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await addWatchedApi(episode, 'episode');
      dispatch(_removeWatchlist(show.show.ids.trakt));
      if (data.added.episodes) {
        const { data: progress } = await getProgressApi(show.show.ids.trakt);
        dispatch(updateProgress({ show, progress }));
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const removeEpisodeWatched = createAsyncThunk(
  'shows/removeEpisodeWatched',
  async (
    {
      show,
      episode,
    }: {
      show: ShowWatched;
      episode: Episode;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await removeWatchedApi(episode, 'episode');
      if (data.deleted.episodes) {
        const { data: progress } = await getProgressApi(show.show.ids.trakt);
        if (!progress.last_episode) {
          dispatch(_removeWatched(show.show.ids.trakt));
        } else {
          dispatch(updateProgress({ show, progress }));
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const addSeasonWatched = createAsyncThunk(
  'shows/addSeasonWatched',
  async (
    {
      season,
      show,
    }: {
      season: Season;
      show: ShowWatched;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await addWatchedApi(season, 'season');
      if (data.added.episodes) {
        const { data: progress } = await getProgressApi(show.show.ids.trakt);
        dispatch(_removeWatchlist(show.show.ids.trakt));
        dispatch(updateProgress({ show, progress }));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeSeasonWatched = createAsyncThunk(
  'shows/removeSeasonWatched',
  async (
    {
      season,
      show,
    }: {
      season: Season;
      show: ShowWatched;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await removeWatchedApi(season, 'season');
      if (data.deleted.episodes) {
        const { data: progress } = await getProgressApi(show.show.ids.trakt);
        if (!progress.last_episode) {
          dispatch(_removeWatched(show.show.ids.trakt));
        } else {
          dispatch(updateProgress({ show, progress }));
        }
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

const showsSlice = createSlice({
  name: 'shows',
  initialState: initialState,
  reducers: {
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
    builder.addCase(addWatchlist.fulfilled, (state, { payload, meta }) => {
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
    }),
});

const { _removeWatchlist, _removeWatched } = showsSlice.actions;

// actions
export const {
  setWatchlist,
  setWatched,
  addWatched,
  updateShow,
  removeWatcheds,
  updateSeasons,
  updateProgress,
} = showsSlice.actions;

// reducer
export const reducer = showsSlice.reducer;
