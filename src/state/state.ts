import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from '../models';

export const PAGE_SIZE = 40;

export type Language = 'en' | 'es';

export interface IState {
  loading: {
    shows: { current: number; total: number };
    movies: { current: number; total: number };
  };
  movies: {
    ready: boolean;
    watched: MovieWatched[];
    watchlist: MovieWatchlist[];
  };
  shows: {
    ready: boolean;
    watched: ShowWatched[];
    watchlist: ShowWatchlist[];
  };
  globalSearch: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

export const initialState = {
  loading: {
    shows: { current: 0, total: 0 },
    // TODO split in watched & watchlist to show several loaders
    movies: { current: 0, total: 0 },
  },
  globalSearch: false,
  serviceWorkerRegistration: null,
};
