import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../state/store';
import {
  addWatchedEpisodesApi,
  addWatchlistShowApi,
  getSeasonsApi,
  getShowApi,
  getTranslationsApi,
  removeWatchedEpisodesApi,
  removeWatchlistApi,
  setHideShow,
} from '../../../utils/api';
import { Season, SeasonEpisode, Show } from '../../../models/Show';
import { Translation, Language } from '../../../models/Translation';
import { Ids } from '../../../models/Ids';
import { firstLoad } from '../../../state/firstLoadAction';
import { ShowStatusComplete } from '../../../models/Api';

const _getRemoteWithTranslations = async (
  id: number,
  language: Language
): Promise<Show & { translation?: Translation }> => {
  const results = await Promise.all([
    getShowApi(id, language),
    getTranslationsApi(id, 'show', language),
  ]);
  if (!results[0]?.ids?.tmdb) {
    throw new Error('No info available for this show: ' + id);
  }
  return { ...results[0], translation: results[1] ?? undefined };
};

export const addWatchlist = createAsyncThunk<
  ShowStatusComplete | null,
  { show: Show }
>('shows/addWatchlist', async ({ show }) => {
  try {
    const { data } = await addWatchlistShowApi(show.ids.tmdb);
    if (data) {
      return { ...data, episodes: [] };
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const removeWatchlist = createAsyncThunk<null, { show: Show }>(
  'shows/removeWatchlist',
  async ({ show }) => {
    try {
      const { data } = await removeWatchlistApi(show.ids.tmdb, 'show');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

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
    await firstLoad();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const removeEpisodeWatched = createAsyncThunk<
  null,
  {
    showIds: Ids;
    episodes: SeasonEpisode[];
  }
>('shows/removeEpisodeWatched', async ({ showIds, episodes }) => {
  try {
    const { data } = await removeWatchedEpisodesApi(showIds, episodes);
    await firstLoad();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const setHiddenShow = createAsyncThunk<
  null,
  { showId: number; hidden: boolean },
  { state: RootState }
>('shows/setHidden', async ({ showId, hidden }) => {
  try {
    const { data } = await setHideShow(showId, hidden);
    await firstLoad();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const fillDetail = createAsyncThunk<
  Show & {
    all_seasons: Season[];
    translation?: Translation;
  },
  {
    id: number;
  },
  { state: RootState }
>('shows/fillDetail', async ({ id }, { getState }) => {
  const language = getState().config.language;
  try {
    const [detail, seasons] = await Promise.all([
      _getRemoteWithTranslations(id, language),
      getSeasonsApi(id, language),
    ]);

    return { ...detail, all_seasons: seasons };
  } catch (e) {
    console.error(e);
    throw e;
  }
});
