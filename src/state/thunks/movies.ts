import { createAsyncThunk } from '@reduxjs/toolkit';
import { Movie, SearchMovie } from 'models';
import {
  addWatchedApi,
  addWatchlistApi,
  getApi,
  getTranslationsApi,
  removeWatchedApi,
  removeWatchlistApi,
} from 'utils/api';
import { getTranslation } from 'utils/getTranslations';

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

export const getMovie = createAsyncThunk(
  'movies/getMovie',
  async ({ id }: { id: number; type: 'watched' | 'watchlist' }) => {
    try {
      const { data } = await getApi<SearchMovie>(id, 'movie');
      const movie = data[0].movie;
      if (movie.available_translations.includes('es')) {
        const { data: translations } = await getTranslationsApi(id, 'movie');
        const { title, overview } = getTranslation(translations);
        movie.title = title;
        movie.overview = overview;
      }
      return movie;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);
