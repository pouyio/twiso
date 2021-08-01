import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AddedWatched,
  AddedWatchlist,
  Movie,
  RemovedWatched,
  RemovedWatchlist,
  SearchMovie,
} from 'models';
import { RootState } from 'state/store';
import {
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';
import { Language } from '../config';

const _getRemoteWithTranslations = async (id: number, language: Language) => {
  const { data } = await getApi<SearchMovie>(id, 'movie');
  const movie = data[0].movie;
  if (language !== 'en' && movie.available_translations.includes(language)) {
    const { title, overview } = await getTranslationsApi(id, 'movie', language);
    movie.title = title;
    movie.overview = overview;
  }
  return movie;
};

export const addWatched = createAsyncThunk<AddedWatched, { movie: Movie }>(
  'movies/addWatched',
  async ({ movie }) => {
    try {
      const { data } = await addWatchedApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatched = createAsyncThunk<RemovedWatched, { movie: Movie }>(
  'movies/removeWatched',
  async ({ movie }) => {
    try {
      const { data } = await removeWatchedApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const addWatchlist = createAsyncThunk<AddedWatchlist, { movie: Movie }>(
  'movies/addWatchlist',
  async ({ movie }) => {
    try {
      const { data } = await addWatchlistApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk<
  RemovedWatchlist,
  { movie: Movie }
>('movies/removeWatchlist', async ({ movie }) => {
  try {
    const { data } = await removeWatchlistApi(movie, 'movie');
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const getMovie = createAsyncThunk<
  Movie,
  { id: number; type: 'watched' | 'watchlist' },
  { state: RootState }
>('movies/getMovie', async ({ id }, { getState }) => {
  return _getRemoteWithTranslations(id, getState().config.language);
});

export const populateDetail = createAsyncThunk<
  Movie,
  { id: number; movie?: Movie },
  { state: RootState }
>('movies/populateDetail', async ({ id, movie }, { getState }) => {
  const state = getState();
  try {
    const foundMovie =
      state.movies.watched.find((w) => w.movie.ids.trakt === id) ||
      state.movies.watchlist.find((w) => w.movie.ids.trakt === id);
    // found in local state
    if (foundMovie) {
      return foundMovie.movie;
    }

    // only translations needed
    if (movie) {
      const language = state.config.language;
      if (
        language !== 'en' &&
        movie.available_translations.includes(language)
      ) {
        const { title, overview } = await getTranslationsApi(
          id,
          'movie',
          language
        );
        movie.title = title;
        movie.overview = overview;
      }
      return movie;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  return _getRemoteWithTranslations(id, state.config.language);
});
