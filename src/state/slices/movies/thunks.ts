import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'state/store';
import {
  addWatchedMovieApi,
  addWatchlistMovieApi,
  getApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';
import { Movie, SearchMovie } from '../../../models/Movie';
import { AddedWatched } from '../../../models/Api';
import { Translation } from 'models/Translation';

export const addWatchedMovie = createAsyncThunk<AddedWatched, { movie: Movie }>(
  'movies/addWatched',
  async ({ movie }) => {
    try {
      if (!movie.ids.imdb) {
        throw Error('no imdb id available');
      }
      const { data } = await addWatchedMovieApi(movie.ids.imdb, 'movie');
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

export const addWatchlist = createAsyncThunk<AddedWatched, { movie: Movie }>(
  'movies/addWatchlist',
  async ({ movie }) => {
    try {
      if (!movie.ids.imdb) {
        throw Error('no imdb id available');
      }
      const { data } = await addWatchlistMovieApi(movie.ids.imdb);
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
      if (!movie.ids.imdb) {
        throw Error('no imdb id available');
      }
      const { data } = await removeWatchlistApi(movie.ids.imdb, 'movie');
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const fillDetail = createAsyncThunk<
  Movie & { translation?: Translation },
  { id: string },
  { state: RootState }
>('movies/fillDetail', async ({ id }) => {
  const results = await Promise.all([
    getApi<SearchMovie>(id, 'movie'),
    getTranslationsApi(id, 'movie', 'es'),
  ]);
  const movie = results[0].data[0].movie;
  return { ...movie, translation: results[1] };
});
