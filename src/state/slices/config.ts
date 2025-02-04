import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import { getImgsConfigApi, getTranslationsApi } from 'utils/api';
import { updateTranslation } from './movies';
import { ImgConfig } from '../../models/ImgConfig';
import { MovieWatched, MovieWatchlist } from '../../models/Movie';
import { ShowWatched, ShowWatchlist } from '../../models/Show';
export type Language = 'en' | 'es';

interface ConfigState {
  img?: ImgConfig;
  language: Language;
}

const initialState: ConfigState = {
  language: (localStorage.getItem('language') || 'en') as Language,
};

const hasLanguage =
  (language: Language, type: 'movie' | 'show') =>
  (m: MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist) =>
    m[type].available_translations.includes(language);

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

    const { watched: watchedMovies, watchlist: watchlistMovies } =
      Object.values(state.movies.movies).reduce(
        (
          acc: {
            watchlist: MovieWatchlist[];
            watched: MovieWatched[];
          },
          s
        ) => {
          if (!s.localState) {
            return acc;
          }
          acc[s.localState].push(s as any);
          return acc;
        },
        { watchlist: [], watched: [] }
      );

    watchedMovies.filter(hasLanguage(language, 'movie')).forEach(async (m) => {
      const { title = m.movie.title, overview = m.movie.overview } =
        await getTranslationsApi(m.movie.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: m.movie.ids.trakt,
        })
      );
    });
    watchlistMovies
      .filter(hasLanguage(language, 'movie'))
      .forEach(async (m) => {
        const { title = m.movie.title, overview = m.movie.overview } =
          await getTranslationsApi(m.movie.ids.trakt, 'show', language);
        dispatch(
          updateTranslation({
            translation: { title, overview },
            id: m.movie.ids.trakt,
          })
        );
      });

    const { watched: watchedShows, watchlist: watchlistShows } = Object.values(
      state.shows.shows
    ).reduce(
      (
        acc: {
          watchlist: ShowWatchlist[];
          watched: ShowWatched[];
        },
        s
      ) => {
        if (!s.localState) {
          return acc;
        }
        acc[s.localState].push(s as any);
        return acc;
      },
      { watchlist: [], watched: [] }
    );

    watchedShows.filter(hasLanguage(language, 'show')).forEach(async (s) => {
      const { title = s.show.title, overview = s.show.overview } =
        await getTranslationsApi(s.show.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: s.show.ids.trakt,
        })
      );
    });
    watchlistShows.filter(hasLanguage(language, 'show')).forEach(async (s) => {
      const { title = s.show.title, overview = s.show.overview } =
        await getTranslationsApi(s.show.ids.trakt, 'show', language);
      dispatch(
        updateTranslation({
          translation: { title, overview },
          id: s.show.ids.trakt,
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
