import { createAsyncThunk } from '@reduxjs/toolkit';
import { Episode, SearchShow, Season, Show, ShowWatched } from 'models';
import {
  updateProgress,
  _removeWatched,
  _removeWatchlist,
} from 'state/slices/showsSlice';
import {
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getProgressApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';
import { getTranslation } from 'utils/getTranslations';

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
  async ({ show }: { show: Show }) => {
    try {
      const { data } = await removeWatchlistApi(show, 'show');
      return data;
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

export const getShow = createAsyncThunk(
  'shows/getShow',
  async ({ id }: { id: number; type: 'watched' | 'watchlist' }) => {
    try {
      const { data } = await getApi<SearchShow>(id, 'show');
      const show = data[0].show;
      if (show.available_translations.includes('es')) {
        const { data: translations } = await getTranslationsApi(id, 'show');
        const { title, overview } = getTranslation(translations);
        show.title = title;
        show.overview = overview;
      }
      return show;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);
