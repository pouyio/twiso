import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from '../state';
import {
  ShowWatchlist,
  ShowWatched,
  Show,
  Season,
  ShowProgress,
  Episode,
} from 'models';
import { Session } from 'contexts/AuthContext';
import {
  addWatchlistApi,
  removeWatchlistApi,
  getProgressApi,
  addWatchedApi,
  removeWatchedApi,
} from 'utils/api';

export const addWatchlist = createAsyncThunk(
  'shows/addWatchlist',
  async ({ show, session }: { show: Show; session: Session }) => {
    try {
      const { data } = await addWatchlistApi(show, session, 'show');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk(
  'shows/removeWatchlist',
  async ({ show, session }: { show: Show; session: Session }, { dispatch }) => {
    try {
      const { data } = await removeWatchlistApi(show, session, 'show');
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
      session,
    }: {
      show: ShowWatched;
      episode: Episode;
      session: Session;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await addWatchedApi(episode, session, 'episode');
      dispatch(_removeWatchlist(show.show.ids.trakt));
      if (data.added.episodes) {
        const { data: progress } = await getProgressApi(
          session,
          show.show.ids.trakt
        );
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
      session,
    }: {
      show: ShowWatched;
      episode: Episode;
      session: Session;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await removeWatchedApi(episode, session, 'episode');
      if (data.deleted.episodes) {
        const { data: progress } = await getProgressApi(
          session,
          show.show.ids.trakt
        );
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
      session,
    }: {
      season: Season;
      show: ShowWatched;
      session: Session;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await addWatchedApi(season, session!, 'season');
      if (data.added.episodes) {
        const { data: progress } = await getProgressApi(
          session,
          show.show.ids.trakt
        );
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
      session,
    }: {
      season: Season;
      show: ShowWatched;
      session: Session;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await removeWatchedApi(season, session!, 'season');
      if (data.deleted.episodes) {
        const { data: progress } = await getProgressApi(
          session,
          show.show.ids.trakt
        );
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
  initialState: initialState.shows,
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

export const {
  setWatchlist,
  setWatched,
  addWatched,
  removeWatcheds,
  updateSeasons,
  updateProgress,
} = showsSlice.actions;

export const reducer = showsSlice.reducer;
