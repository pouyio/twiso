import { IState } from './state';
import {
  getImgsConfigApi,
  addWatchedApi,
  removeWatchedApi,
  addWatchlistApi,
  removeWatchlistApi,
} from '../utils/api';
import {
  ImgConfig,
  MovieWatched,
  MovieWatchlist,
  ShowWatchlist,
  ShowWatched,
  Movie,
  Show,
} from '../models';
import { Session } from '../utils/AuthContext';

export type Action =
  | {
      type: 'GET_IMG_CONFIG';
      payload: ImgConfig;
    }
  | { type: 'ADD_WATCHED_MOVIES'; payload: MovieWatched[] }
  | { type: 'REMOVE_WATCHED_MOVIE'; payload: Movie }
  | { type: 'ADD_WATCHLIST_MOVIES'; payload: MovieWatchlist[] }
  | { type: 'ADD_WATCHLIST_MOVIE'; payload: MovieWatchlist }
  | { type: 'REMOVE_WATCHLIST_MOVIE'; payload: Movie }
  | { type: 'ADD_WATCHLIST_SHOW'; payload: ShowWatchlist }
  | { type: 'REMOVE_WATCHED_SHOW'; payload: Show }
  | { type: 'REMOVE_WATCHLIST_SHOW'; payload: Show }
  | { type: 'ADD_WATCHED_SHOWS'; payload: ShowWatched[] }
  | { type: 'ADD_WATCHLIST_SHOWS'; payload: ShowWatchlist[] }
  | { type: 'UPDATE_SHOW'; payload: ShowWatched };

export interface IDispatchFunctions {
  getImgConfig: () => void;
  addMovieWatched: (movie: Movie, session: Session) => void;
  removeMovieWatched: (movie: Movie, session: Session) => void;
  addMovieWatchlist: (movie: Movie, session: Session) => void;
  removeMovieWatchlist: (movie: Movie, session: Session) => void;
  addShowWatchlist: (show: Show, session: Session) => void;
  removeShowWatchlist: (show: Show, session: Session) => void;
  updateShow: (show: Show) => void;
}
export const dispatchFunctions = (
  state: IState,
  dispatch: (action: Action) => void,
): IDispatchFunctions => {
  const getImgConfig = () => {
    getImgsConfigApi().then(({ data }) => {
      dispatch({ type: 'GET_IMG_CONFIG', payload: data });
    });
  };
  const addMovieWatched = async (movie: Movie, session: Session) => {
    const { data } = await addWatchedApi(movie, session, 'movie');
    if (data.added.movies) {
      dispatch({
        type: 'ADD_WATCHED_MOVIES',
        payload: [
          { movie, type: 'movie', watched_at: new Date().toISOString() },
        ],
      });
      dispatch({ type: 'REMOVE_WATCHLIST_MOVIE', payload: movie });
    }
  };
  const removeMovieWatched = async (movie: Movie, session: Session) => {
    const { data } = await removeWatchedApi(movie, session, 'movie');
    if (data.deleted.movies) {
      dispatch({ type: 'REMOVE_WATCHED_MOVIE', payload: movie });
    }
  };
  const addMovieWatchlist = async (movie: Movie, session: Session) => {
    const { data } = await addWatchlistApi(movie, session, 'movie');
    if (data.added.movies) {
      dispatch({
        type: 'ADD_WATCHLIST_MOVIE',
        payload: { movie, type: 'movie' } as MovieWatchlist,
      });
      dispatch({ type: 'REMOVE_WATCHED_MOVIE', payload: movie });
    }
  };
  const removeMovieWatchlist = async (movie: Movie, session: Session) => {
    const { data } = await removeWatchlistApi(movie, session!, 'movie');
    if (data.deleted.movies) {
      dispatch({ type: 'REMOVE_WATCHLIST_MOVIE', payload: movie });
    }
  };
  const addShowWatchlist = async (show: Show, session: Session) => {
    const { data } = await addWatchlistApi(show, session, 'show');
    if (data.added.shows) {
      dispatch({
        type: 'ADD_WATCHLIST_SHOW',
        payload: { show, type: 'show' },
      });
      dispatch({ type: 'REMOVE_WATCHED_SHOW', payload: show });
    }
  };
  const removeShowWatchlist = async (show: Show, session: Session) => {
    const { data } = await removeWatchlistApi(show, session, 'show');
    if (data.deleted.shows) {
      dispatch({
        type: 'REMOVE_WATCHLIST_SHOW',
        payload: show,
      });
    }
  };
  const updateShow = (show: Show) => {
    const updatedShow = state.userInfo.shows.watched.find(
      i => i.show.ids.trakt === show.ids.trakt,
    );
    // TODO: only works for shows that are already watched
    // should add new shows too, probably should make a request to progress and then add it.
    if (!updatedShow) {
      return;
    }
    dispatch({
      type: 'UPDATE_SHOW',
      payload: updatedShow,
    });
  };

  return {
    getImgConfig,
    addMovieWatched,
    removeMovieWatched,
    addMovieWatchlist,
    removeMovieWatchlist,
    addShowWatchlist,
    removeShowWatchlist,
    updateShow,
  };
};
