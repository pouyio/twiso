import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import {
  addWatchedEpisodesApi,
  addWatchlistApi,
  getApi,
  getSeasonsApi,
  getTranslationsApi,
  removeWatchedEpisodesApi,
  removeWatchlistApi,
  setHideShow,
} from 'utils/api';
import { SearchShow } from '../../../models/Movie';
import { AddedWatchlist, RemovedWatchlist } from '../../../models/Api';
import { SeasonEpisode, Show } from '../../../models/Show';
import { Translation } from 'models/Translation';
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
>('shows/fillDetail', async ({ id }) => {
  try {
    const [detail, seasons] = await Promise.all([
      _getRemoteWithTranslations(id),
      getSeasonsApi(id, 'es'),
    ]);

    return { ...detail, all_seasons: seasons };
  } catch (e) {
    console.error(e);
    throw e;
  }
});
