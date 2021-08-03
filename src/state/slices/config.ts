import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ImgConfig,
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';
import { RootState } from 'state/store';
import { getImgsConfigApi, getTranslationsApi } from 'utils/api';
import { updateTranslation } from './movies';
export type Language = 'en' | 'es';

interface ConfigState {
  img?: ImgConfig;
  language: Language;
}

const initialState: ConfigState = {
  language: (localStorage.getItem('language') || 'en') as Language,
};

const hasLanguage = (language: Language, type: 'movie' | 'show') => (
  m: MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist
) => m[type].available_translations.includes(language);

// thunks
export const loadImgConfig = createAsyncThunk('config/load', async () => {
  try {
    const { data } = await getImgsConfigApi();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const changeLanguage = createAsyncThunk<
  void,
  { language: Language },
  { state: RootState }
>('config/changeLanguage', async ({ language }, { getState, dispatch }) => {
  try {
    const state = getState();

    const watchedMovies = state.movies.watched.filter(
      hasLanguage(language, 'movie')
    );
    const watchlistMovies = state.movies.watchlist.filter(
      hasLanguage(language, 'movie')
    );

    watchedMovies.forEach(async (m) => {
      const {
        title = m.movie.title,
        overview = m.movie.overview,
      } = await getTranslationsApi(m.movie.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: m.movie.ids.trakt,
          type: 'watched',
        })
      );
    });
    watchlistMovies.forEach(async (m) => {
      const {
        title = m.movie.title,
        overview = m.movie.overview,
      } = await getTranslationsApi(m.movie.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: m.movie.ids.trakt,
          type: 'watchlist',
        })
      );
    });

    const watchedShows = state.shows.watched.filter(
      hasLanguage(language, 'show')
    );
    const watchlistShows = state.shows.watchlist.filter(
      hasLanguage(language, 'show')
    );

    watchedShows.forEach(async (s) => {
      const {
        title = s.show.title,
        overview = s.show.overview,
      } = await getTranslationsApi(s.show.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: s.show.ids.trakt,
          type: 'watched',
        })
      );
    });
    watchlistShows.forEach(async (s) => {
      const {
        title = s.show.title,
        overview = s.show.overview,
      } = await getTranslationsApi(s.show.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: s.show.ids.trakt,
          type: 'watchlist',
        })
      );
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
});

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadImgConfig.fulfilled, (state, { payload }) => {
        state.img = payload;
      })
      .addCase(changeLanguage.fulfilled, (state, { meta }) => {
        localStorage.setItem('language', meta.arg.language);
        state.language = meta.arg.language;
      });
  },
});

// reducer
export const reducer = configSlice.reducer;
