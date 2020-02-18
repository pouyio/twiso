import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
  ImgConfig,
} from '../models';

export const PAGE_SIZE = 40;

interface IUserInfo {
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
}

export interface IState {
  loading: {
    shows: { current: number; total: number };
  };
  userInfo: IUserInfo;
  config?: ImgConfig;
  language: string;
}

export const initialState: IState = {
  loading: {
    shows: { current: 0, total: 0 },
  },
  userInfo: {
    movies: {
      ready: false,
      watched: [],
      watchlist: [],
    },
    shows: {
      ready: false,
      watched: [],
      watchlist: [],
    },
  },
  language: 'es',
};
