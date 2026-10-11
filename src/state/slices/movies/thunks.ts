import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../state/store';
import {
  addWatchedMovieApi,
  addWatchlistMovieApi,
  getMovieApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from '../../../utils/api';
import { Movie } from '../../../models/Movie';
import { AddedWatched } from '../../../models/Api';
import { Translation, Language } from '../../../models/Translation';

export const addWatchedMovie = createAsyncThunk<AddedWatched, { movie: Movie }>(
  'movies/addWatched',
  async ({ movie }) => {
    try {
      const { data } = await addWatchedMovieApi(movie.ids.tmdb, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatched = createAsyncThunk<null, { movie: Movie }>(
  'movies/removeWatched',
  async ({ movie }) => {
    try {
      const { data } = await removeWatchedApi(movie.ids.tmdb, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const addWatchlist = createAsyncThunk<AddedWatched, { movie: Movie }>(
  'movies/addWatchlist',
  async ({ movie }) => {
    try {
      const { data } = await addWatchlistMovieApi(movie.ids.tmdb);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk<null, { movie: Movie }>(
  'movies/removeWatchlist',
  async ({ movie }) => {
    try {
      const { data } = await removeWatchlistApi(movie.ids.tmdb, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const fillDetail = createAsyncThunk<
  Movie & { translation?: Translation; contentLanguage?: Language },
  { id: number },
  { state: RootState }
>('movies/fillDetail', async ({ id }, { getState }) => {
  const language = getState().config.language;
  const results = await Promise.all([
    getMovieApi(id, language),
    getTranslationsApi(id, 'movie', language),
  ]);
  if (!results[0]?.ids?.tmdb) {
    throw new Error('No info available for this movie: ' + id);
  }
  return {
    ...results[0],
    translation: results[1] ?? undefined,
    contentLanguage: language,
  };
});
