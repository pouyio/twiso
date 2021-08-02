import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AddedWatchlist,
  Episode,
  RemovedWatchlist,
  SearchShow,
  Season,
  Show,
  ShowProgress,
  ShowWatched,
} from 'models';
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
import { Language } from '../config';

const _getRemoteWithTranslations = async (id: number, language: Language) => {
  const { data } = await getApi<SearchShow>(id, 'show');
  const show = data[0].show;
  if (language !== 'en' && show.available_translations.includes(language)) {
    const { title, overview } = await getTranslationsApi(id, 'show', language);
    show.title = title;
    show.overview = overview;
  }
  return show;
};

export const addWatchlist = createAsyncThunk<AddedWatchlist, { show: Show }>(
  'shows/addWatchlist',
  async ({ show }) => {
    try {
      const { data } = await addWatchlistApi(show, 'show');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk<
  RemovedWatchlist,
  { show: Show }
>('shows/removeWatchlist', async ({ show }) => {
  try {
    const { data } = await removeWatchlistApi(show, 'show');
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const addEpisodeWatched = createAsyncThunk<
  ShowWatched,
  {
    show: ShowWatched;
    episode: Episode;
  },
  { state: RootState }
>('shows/addEpisodeWatched', async ({ show, episode }, { getState }) => {
  try {
    const { data } = await addWatchedApi(episode, 'episode');
    if (data.added.episodes) {
      const { data: progress } = await getProgressApi(show.show.ids.trakt);
      const state = getState();
      const showIndex = state.shows.watched.findIndex(
        (s) => s.show.ids.trakt === show.show.ids.trakt
      );
      const updatedShow: ShowWatched = JSON.parse(JSON.stringify(show));
      if (showIndex === -1) {
        if (
          state.config.language !== 'en' &&
          show.show.available_translations.includes(state.config.language)
        ) {
          const { title, overview } = await getTranslationsApi(
            show.show.ids.trakt,
            'show',
            state.config.language
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
  } catch (e) {
    console.error(e);
    throw e;
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
  try {
    const { data } = await removeWatchedApi(episode, 'episode');
    if (data.deleted.episodes) {
      const { data: progress } = await getProgressApi(show.show.ids.trakt);
      if (!progress.last_episode) {
        return false;
      } else {
        return progress;
      }
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
  throw Error('shows/addEpisodeWatched failed');
});

export const addSeasonWatched = createAsyncThunk<
  ShowWatched,
  {
    season: Season;
    show: ShowWatched;
  },
  { state: RootState }
>('shows/addSeasonWatched', async ({ season, show }, { getState }) => {
  try {
    const { data } = await addWatchedApi(season, 'season');
    if (data.added.episodes) {
      const { data: progress } = await getProgressApi(show.show.ids.trakt);
      const state = getState();
      const showIndex = state.shows.watched.findIndex(
        (s) => s.show.ids.trakt === show.show.ids.trakt
      );
      const updatedShow: ShowWatched = JSON.parse(JSON.stringify(show));
      if (showIndex === -1) {
        if (
          state.config.language !== 'en' &&
          show.show.available_translations.includes(state.config.language)
        ) {
          const { title, overview } = await getTranslationsApi(
            show.show.ids.trakt,
            'show',
            state.config.language
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
  } catch (e) {
    console.error(e);
    throw e;
  }
  throw Error('shows/addSeasonWatched failed');
});

export const removeSeasonWatched = createAsyncThunk<
  ShowProgress | false,
  { season: Season; show: ShowWatched }
>('shows/removeSeasonWatched', async ({ season, show }) => {
  try {
    const { data } = await removeWatchedApi(season, 'season');
    if (data.deleted.episodes) {
      const { data: progress } = await getProgressApi(show.show.ids.trakt);
      if (!progress.last_episode) {
        return false;
      } else {
        return progress;
      }
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
  throw Error('shows/removeSeasonWatched failed');
});

export const getShow = createAsyncThunk<
  Show,
  { id: number; type: 'watched' | 'watchlist' },
  { state: RootState }
>('shows/getShow', async ({ id }, { getState }) => {
  try {
    return _getRemoteWithTranslations(id, getState().config.language);
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const updateFullShow = createAsyncThunk<
  ShowWatched,
  {
    outdated: ShowWatched;
  },
  { state: RootState }
>('shows/updateFullShow', async ({ outdated }, { getState }) => {
  const showCopy: ShowWatched = JSON.parse(JSON.stringify(outdated));
  try {
    const language = getState().config.language;
    const translationAvailable =
      language !== 'en' &&
      showCopy.show.available_translations.includes(language);

    const [seasons, progress, translations] = await Promise.all([
      getSeasonsApi(showCopy.show.ids.trakt, language),
      getProgressApi(showCopy.show.ids.trakt),
      translationAvailable
        ? getTranslationsApi(
            showCopy.show.ids.trakt,
            'show',
            getState().config.language
          )
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
});

export const populateDetail = createAsyncThunk<
  Show,
  { id: number; show?: Show },
  { state: RootState }
>('shows/populateDetail', async ({ id, show }, { getState }) => {
  try {
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
      if (
        state.config.language !== 'en' &&
        show.available_translations.includes(state.config.language)
      ) {
        const { title, overview } = await getTranslationsApi(
          id,
          'show',
          state.config.language
        );
        show.title = title;
        show.overview = overview;
      }
      return show;
    }

    return _getRemoteWithTranslations(id, state.config.language);
  } catch (e) {
    console.error(e);
    throw e;
  }
});
