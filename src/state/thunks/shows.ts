import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  Episode,
  SearchShow,
  Season,
  Show,
  ShowProgress,
  ShowWatched,
} from 'models';
import {
  updateProgress,
  _removeWatched,
  _removeWatchlist,
} from 'state/slices/showsSlice';
import { RootState } from 'state/store';
import {
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getProgressApi,
  getSeasonsApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';

const _getRemoteWithTranslations = async (id: number) => {
  const { data } = await getApi<SearchShow>(id, 'show');
  const show = data[0].show;
  if (show.available_translations.includes('es')) {
    const { title, overview } = await getTranslationsApi(id, 'show');
    show.title = title;
    show.overview = overview;
  }
  return show;
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

export const addEpisodeWatched = createAsyncThunk<
  ShowWatched,
  {
    show: ShowWatched;
    episode: Episode;
  },
  { state: RootState }
>('shows/addEpisodeWatched', async ({ show, episode }, { getState }) => {
  const { data } = await addWatchedApi(episode, 'episode');
  if (data.added.episodes) {
    const { data: progress } = await getProgressApi(show.show.ids.trakt);
    const state = getState();
    const showIndex = state.shows.watched.findIndex(
      (s) => s.show.ids.trakt === show.show.ids.trakt
    );
    const updatedShow = { ...show };
    if (showIndex === -1) {
      if (show.show.available_translations.includes('es')) {
        const { title, overview } = await getTranslationsApi(
          show.show.ids.trakt,
          'show'
        );
        updatedShow.show.title = title;
        updatedShow.show.overview = overview;
      }
    }
    return {
      ...(showIndex === -1 ? updatedShow : state.shows.watched[showIndex]),
      last_watched_at: progress.last_watched_at,
      progress,
    };
  }
  throw Error('shows/addEpisodeWatched failed');
});

export const removeEpisodeWatched = createAsyncThunk<
  ShowProgress | false,
  {
    show: ShowWatched;
    episode: Episode;
  }
>('shows/removeEpisodeWatched', async ({ show, episode }) => {
  const { data } = await removeWatchedApi(episode, 'episode');
  if (data.deleted.episodes) {
    const { data: progress } = await getProgressApi(show.show.ids.trakt);
    if (!progress.last_episode) {
      return false;
    } else {
      return progress;
    }
  }
  throw Error('shows/addEpisodeWatched failed');
});

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

export const getShow = createAsyncThunk<
  Show,
  { id: number; type: 'watched' | 'watchlist' }
>('shows/getShow', async ({ id }) => {
  return _getRemoteWithTranslations(id);
});

export const updateFullShow = createAsyncThunk(
  'shows/updateFullShow',
  async ({ outdated }: { outdated: ShowWatched }) => {
    const showCopy = JSON.parse(JSON.stringify(outdated));
    try {
      const translationAvailable = showCopy.show.available_translations.includes(
        'es'
      );
      const [seasons, progress, translations] = await Promise.all([
        getSeasonsApi(showCopy.show.ids.trakt),
        getProgressApi(showCopy.show.ids.trakt),
        translationAvailable
          ? getTranslationsApi(showCopy.show.ids.trakt, 'show')
          : null,
      ]);

      showCopy.fullSeasons = seasons.data;
      showCopy.progress = progress.data;
      showCopy.last_watched_at = progress.data.last_watched_at;

      if (translationAvailable && translations) {
        showCopy.show.title = translations.title;
        showCopy.show.overview = translations.overview;
      }
      return showCopy;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const populateDetail = createAsyncThunk<
  Show,
  { id: number; show?: Show },
  { state: RootState }
>('shows/populateDetail', async ({ id, show }, { getState }) => {
  const state = getState();
  const foundShow =
    state.shows.watched.find((w) => w.show.ids.trakt === id) ||
    state.shows.watchlist.find((w) => w.show.ids.trakt === id);
  // found in local state
  if (foundShow) {
    return foundShow.show;
  }

  // only translations needed
  if (show) {
    if (show.available_translations.includes('es')) {
      const { title, overview } = await getTranslationsApi(id, 'show');
      show.title = title;
      show.overview = overview;
    }
    return show;
  }

  return _getRemoteWithTranslations(id);
});
