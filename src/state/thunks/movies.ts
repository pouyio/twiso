import { createAsyncThunk } from '@reduxjs/toolkit';
import { Movie, SearchMovie } from 'models';
import { RootState } from 'state/store';
import {
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';

const _getRemoteWithTranslations = async (id: number) => {
  const { data } = await getApi<SearchMovie>(id, 'movie');
  const movie = data[0].movie;
  if (movie.available_translations.includes('es')) {
    const { title, overview } = await getTranslationsApi(id, 'movie');
    movie.title = title;
    movie.overview = overview;
  }
  return movie;
};

export const addWatched = createAsyncThunk(
  'movies/addWatched',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await addWatchedApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatched = createAsyncThunk(
  'movies/removeWatched',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await removeWatchedApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const addWatchlist = createAsyncThunk(
  'movies/addWatchlist',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await addWatchlistApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const removeWatchlist = createAsyncThunk(
  'movies/removeWatchlist',
  async ({ movie }: { movie: Movie }) => {
    try {
      const { data } = await removeWatchlistApi(movie, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const getMovie = createAsyncThunk<
  Movie,
  { id: number; type: 'watched' | 'watchlist' }
>('movies/getMovie', async ({ id }) => {
  return _getRemoteWithTranslations(id);
});

export const populateDetail = createAsyncThunk<
  Movie,
  { id: number; movie?: Movie },
  { state: RootState }
>('movies/populateDetail', async ({ id, movie }, { getState }) => {
  const state = getState();
  const foundMovie =
    state.movies.watched.find((w) => w.movie.ids.trakt === id) ||
    state.movies.watchlist.find((w) => w.movie.ids.trakt === id);
  // found in local state
  if (foundMovie) {
    return foundMovie.movie;
  }

  // only translations needed
  if (movie) {
    if (movie.available_translations.includes('es')) {
      const { title, overview } = await getTranslationsApi(id, 'movie');
      movie.title = title;
      movie.overview = overview;
    }
    return movie;
  }

  return _getRemoteWithTranslations(id);
});
