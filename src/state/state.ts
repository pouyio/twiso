import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
  ImgConfig,
} from '../models';

export const PAGE_SIZE = 40;

export type Language = 'en' | 'es';

export interface IState {
  loading: {
    shows: { current: number; total: number };
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
  config: { img?: ImgConfig; language: Language };
}

export const initialState: IState = {
  loading: {
    shows: { current: 0, total: 0 },
  },
  movies: {
    ready: true,
    watched: [],
    watchlist: [],
  },
  shows: {
    ready: true,
    watched: [],
    watchlist: [],
  },
  config: {
    language: (localStorage.getItem('language') || 'en') as Language,
  },
  globalSearch: false,
  serviceWorkerRegistration: null,
};
