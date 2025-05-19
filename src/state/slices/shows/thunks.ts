import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import {
  addHideShow,
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getProgressApi,
  getSeasonsApi,
  getTranslationsApi,
  removeHideShow,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';
import { SearchShow } from '../../../models/Movie';
import { AddedWatchlist, RemovedWatchlist } from '../../../models/Api';
import {
  Episode,
  Season,
  Show,
  ShowProgress,
  ShowWatched,
  ShowWatchlist,
} from '../../../models/Show';
import { Language, Translation } from 'models/Translation';

const _getRemoteWithTranslations = async (
  id: string
): Promise<Show & { translation?: Translation }> => {
  const results = await Promise.all([
    getApi<SearchShow>(id),
    getTranslationsApi(id, 'show', 'es'),
  ]);
  const show = results[0].data[0].show;
  return { ...show, translation: results[1] };
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
      const updatedShow: ShowWatched = JSON.parse(JSON.stringify(show));
      if (state.shows.shows[show.show.ids.trakt]) {
        if (
          state.config.language !== 'en' &&
          show.show.available_translations.includes(state.config.language)
        ) {
          const { title, overview } = await getTranslationsApi(
            show.show.ids.trakt,
            'show',
            state.config.language
          );
          updatedShow.show.title = title || show.show.title;
          updatedShow.show.overview = overview || show.show.overview;
        }
      }
      return {
        ...(state.shows.shows[show.show.ids.trakt] || updatedShow),
        last_watched_at: progress.last_watched_at,
        progress,
      } as ShowWatched;
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
      const updatedShow: ShowWatched = JSON.parse(JSON.stringify(show));
      if (!state.shows.shows[show.show.ids.trakt]) {
        if (
          state.config.language !== 'en' &&
          show.show.available_translations.includes(state.config.language)
        ) {
          const { title, overview } = await getTranslationsApi(
            show.show.ids.trakt,
            'show',
            state.config.language
          );
          updatedShow.show.title = title || show.show.title;
          updatedShow.show.overview = overview || show.show.overview;
        }
      }
      return {
        ...(state.shows.shows[show.show.ids.trakt] || updatedShow),
        last_watched_at: progress.last_watched_at,
        progress,
      } as ShowWatched;
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

export const updateFullShow = createAsyncThunk<
  ShowWatched | ShowWatchlist,
  {
    outdated: ShowWatched | ShowWatchlist;
  },
  { state: RootState }
>('shows/updateFullShow', async ({ outdated }, { getState }) => {
  const showCopy: ShowWatched | ShowWatchlist = structuredClone(outdated);
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
    showCopy.last_watched_at = progress?.data.last_watched_at;

    if (translationAvailable && translations) {
      showCopy.show.title = translations.title || showCopy.show.title;
      showCopy.show.overview = translations.overview || showCopy.show.overview;
    }
    return showCopy;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const fillDetail = createAsyncThunk<
  Show,
  {
    id: string;
  },
  { state: RootState }
>('shows/fillDetail', async ({ id }, { getState }) => {
  try {
    const language = getState().config.language;
    // const translationAvailable =
    //   language !== 'en' &&
    //   showCopy.show.available_translations.includes(language);

    const [detail, seasons] = await Promise.all([
      _getRemoteWithTranslations(id),
      getSeasonsApi(id, 'es'),
      // getProgressApi(id),
      // translationAvailable
      //   ? getTranslationsApi(
      //       `${showCopy.show.ids.trakt}`,
      //       'show',
      //       getState().config.language
      //     )
      //   : null,
    ]);

    // showCopy.fullSeasons = seasons.data;
    // showCopy.progress = progress.data;
    // showCopy.last_watched_at = progress?.data.last_watched_at;
    //
    // if (translationAvailable && translations) {
    //   showCopy.show.title = translations.title || showCopy.show.title;
    //   showCopy.show.overview = translations.overview || showCopy.show.overview;
    // }
    return { ...detail, all_seasons: seasons };
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
    const foundShow = state.shows.shows[id];
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
        show.title = title || show.title;
        show.overview = overview || show.overview;
      }
      return show;
    }

    return _getRemoteWithTranslations(id, state.config.language);
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const toggleHidden = createAsyncThunk<
  boolean,
  number,
  { state: RootState }
>('shows/toggleHidden', async (id, { getState }) => {
  const state = getState();
  const isHidden = state.shows.hidden[id];

  try {
    if (isHidden) {
      const response = await removeHideShow(id);
      return response.data.deleted.shows === 1 ? false : true;
    }

    const response = await addHideShow(id);
    return response.data.added.shows === 1 ? true : false;
  } catch (e) {
    console.error(e);
    throw e;
  }
});
