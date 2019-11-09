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
    watched: MovieWatched[];
    watchlist: MovieWatchlist[];
  };
  shows: {
    watched: ShowWatched[];
    watchlist: ShowWatchlist[];
  };
}

export interface IState {
  userInfo: IUserInfo;
  config?: ImgConfig;
  language: string;
  PAGE_SIZE: number;
}

export const initialState: IState = {
  PAGE_SIZE,
  userInfo: {
    movies: {
      watched: [],
      watchlist: [],
    },
    shows: {
      watched: [],
      watchlist: [],
    },
  },
  language: 'es',
};
