import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import {
  addWatchedApi,
  addWatchedEpisodesApi,
  addWatchlistApi,
  getApi,
  getProgressApi,
  getSeasonsApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchedEpisodesApi,
  removeWatchlistApi,
  setHideShow,
} from 'utils/api';
import { SearchShow } from '../../../models/Movie';
import { AddedWatchlist, RemovedWatchlist } from '../../../models/Api';
import {
  Episode,
  Season,
  SeasonEpisode,
  Show,
  ShowProgress,
  ShowWatched,
  ShowWatchlist,
} from '../../../models/Show';
import { Language, Translation } from 'models/Translation';
import { Ids } from 'models/Ids';
import { firstLoad } from 'state/firstLoadAction';

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
    if (!show.ids.imdb) {
      throw Error('no imdb id available');
    }
    try {
      const { data } = await addWatchlistApi(show.ids.imdb, 'show');
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
  if (!show.ids.imdb) {
    throw Error('no imdb id available');
  }
  try {
    const { data } = await removeWatchlistApi(show.ids.imdb, 'show');
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const addEpisodeWatched = createAsyncThunk<
  any,
  {
    showIds: Ids;
    episodes: SeasonEpisode[];
  },
  { state: RootState }
>('shows/addEpisodeWatched', async ({ showIds, episodes }) => {
  try {
    const { data } = await addWatchedEpisodesApi(showIds, episodes);
    firstLoad();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const removeEpisodeWatched = createAsyncThunk<
  any,
  {
    showIds: Ids;
    episodes: Ids[];
  }
>('shows/removeEpisodeWatched', async ({ showIds, episodes }) => {
  try {
    const { data } = await removeWatchedEpisodesApi(showIds, episodes);
    firstLoad();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
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
export const setHiddenShow = createAsyncThunk<
  any,
  { showId: string; hidden: boolean },
  { state: RootState }
>('shows/setHidden', async ({ showId, hidden }) => {
  try {
    const response = await setHideShow(showId, hidden);
    firstLoad();
    return response;
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
