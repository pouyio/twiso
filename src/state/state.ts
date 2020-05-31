import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
  ImgConfig,
} from '../models';

export const PAGE_SIZE = 40;
const LANGUAGE = 'es';

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
  globalSearch?: boolean;
  config?: ImgConfig;
  language: string;
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
  language: LANGUAGE,
};
