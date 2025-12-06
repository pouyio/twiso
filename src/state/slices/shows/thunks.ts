import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import {
  addWatchedEpisodesApi,
  addWatchlistShowApi,
  getApi,
  getSeasonsApi,
  getTranslationsApi,
  removeWatchedEpisodesApi,
  removeWatchlistApi,
  setHideShow,
} from 'utils/api';
import { SearchShow } from '../../../models/Movie';
import { Season, SeasonEpisode, Show } from '../../../models/Show';
import { Translation } from 'models/Translation';
import { Ids } from 'models/Ids';
import { firstLoad } from 'state/firstLoadAction';
import { ShowStatusComplete } from 'models/Api';

const _getRemoteWithTranslations = async (
  id: string
): Promise<Show & { translation?: Translation }> => {
  const results = await Promise.all([
    getApi<SearchShow>(id, 'show'),
    getTranslationsApi(id, 'show', 'es'),
  ]);
  const show = results[0].data[0].show;
  return { ...show, translation: results[1] };
};

export const addWatchlist = createAsyncThunk<
  ShowStatusComplete | null,
  { show: Show }
>('shows/addWatchlist', async ({ show }) => {
  if (!show.ids.imdb) {
    throw Error('no imdb id available');
  }
  try {
    const { data } = await addWatchlistShowApi(show.ids.imdb);
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
  { showId: string; hidden: boolean },
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
