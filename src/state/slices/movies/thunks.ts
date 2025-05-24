import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import {
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';
import { Movie, SearchMovie } from '../../../models/Movie';
import {
  AddedWatched,
  AddedWatchlist,
  RemovedWatched,
  RemovedWatchlist,
} from '../../../models/Api';

export const addWatched = createAsyncThunk<AddedWatched, { movie: Movie }>(
  'movies/addWatched',
  async ({ movie }) => {
    try {
      if (!movie.ids.imdb) {
        throw Error('no imdb id available');
      }
      const { data } = await addWatchedApi(movie.ids.imdb, 'movie');
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
      if (!movie.ids.imdb) {
        throw Error('no imdb id available');
      }
      const { data } = await removeWatchedApi(movie.ids.imdb, 'movie');
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
      if (!movie.ids.imdb) {
        throw Error('no imdb id available');
      }
      const { data } = await addWatchlistApi(movie.ids.imdb, 'movie');
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
    if (!movie.ids.imdb) {
      throw Error('no imdb id available');
    }
    const { data } = await removeWatchlistApi(movie.ids.imdb, 'movie');
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const fillDetail = createAsyncThunk<
  Movie,
  { id: string },
  { state: RootState }
>('movies/fillDetail', async ({ id }) => {
  const results = await Promise.all([
    getApi<SearchMovie>(id),
    getTranslationsApi(id, 'movie', 'es'),
  ]);
  const movie = results[0].data[0].movie;
  return { ...movie, translation: results[1] };
});
