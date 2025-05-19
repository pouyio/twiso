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
import { Translation } from 'models/Translation';

const _getRemoteWithTranslations = async (
  id: string
): Promise<Movie & { translation?: Translation }> => {
  const results = await Promise.all([
    getApi<SearchMovie>(id),
    getTranslationsApi(id, 'movie', 'es'),
  ]);
  const movie = results[0].data[0].movie;
  return { ...movie, translation: results[1] };
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
  { id: string },
  { state: RootState }
>('movies/getMovie', async ({ id }, { getState }) => {
  const language = getState().config.language;

  // assume movie has translation and make both queries together
  const responses = await Promise.all([
    getApi<SearchMovie>(id),
    getTranslationsApi(id, 'movie', language),
  ]);
  const movie = responses[0].data[0].movie;
  const { title = '', overview = '' } = responses[1];

  movie.title = title || movie.title;
  movie.overview = overview || movie.overview;
  return movie;
});

export const fillDetail = createAsyncThunk<
  Movie,
  { id: string },
  { state: RootState }
>('movies/fillDetail', async ({ id }) => {
  return _getRemoteWithTranslations(id);
});

export const populateDetail = createAsyncThunk<
  Movie,
  { id: string; movie?: Movie },
  { state: RootState }
>('movies/populateDetail', async ({ id, movie }, { getState }) => {
  const state = getState();
  const updatedMovie: Partial<Movie> =
    structuredClone<Movie | undefined>(movie) || {};
  try {
    const foundMovie = state.movies.movies[id];
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
        updatedMovie.title = title || movie.title;
        updatedMovie.overview = overview || movie.overview;
      }
      return updatedMovie;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  return _getRemoteWithTranslations(id);
});
