import { IState } from './state';
import {
  addWatchedApi,
  removeWatchedApi,
  addWatchlistApi,
  removeWatchlistApi,
  getProgressApi,
} from '../utils/api';
import {
  ImgConfig,
  MovieWatched,
  MovieWatchlist,
  ShowWatchlist,
  ShowWatched,
  Movie,
  Show,
  ShowProgress,
  Season,
  Episode,
} from '../models';
import { Session } from '../utils/AuthContext';
import load from './firstLoadAction';

export type Action =
  | {
      type: 'GET_IMG_CONFIG';
      payload: ImgConfig;
    }
  | { type: 'SET_WATCHED_MOVIES'; payload: MovieWatched[] }
  | { type: 'ADD_WATCHED_MOVIE'; payload: MovieWatched }
  | { type: 'REMOVE_WATCHED_MOVIE'; payload: Movie }
  | { type: 'SET_WATCHLIST_MOVIES'; payload: MovieWatchlist[] }
  | { type: 'ADD_WATCHLIST_MOVIE'; payload: MovieWatchlist }
  | { type: 'REMOVE_WATCHLIST_MOVIE'; payload: Movie }
  | { type: 'ADD_WATCHLIST_SHOW'; payload: ShowWatchlist }
  | { type: 'REMOVE_WATCHED_SHOW'; payload: Show }
  | { type: 'REMOVE_WATCHED_SHOWS'; payload: ShowWatched[] }
  | { type: 'REMOVE_WATCHLIST_SHOW'; payload: Show }
  | { type: 'SET_WATCHED_SHOWS'; payload: ShowWatched[] }
  | { type: 'ADD_WATCHED_SHOW'; payload: ShowWatched }
  | { type: 'SET_WATCHLIST_SHOWS'; payload: ShowWatchlist[] }
  | {
      type: 'UPDATE_SHOW_PROGRESS';
      payload: { show: ShowWatched; progress: ShowProgress };
    }
  | {
      type: 'UPDATE_SHOW_SEASONS';
      payload: { show: ShowWatched; seasons: Season[] };
    };

export interface IDispatchFunctions {
  firstLoad: (session: Session | null) => Promise<boolean>;
  addMovieWatched: (movie: Movie, session: Session) => void;
  removeMovieWatched: (movie: Movie, session: Session) => void;
  addMovieWatchlist: (movie: Movie, session: Session) => void;
  removeMovieWatchlist: (movie: Movie, session: Session) => void;
  addShowWatchlist: (show: Show, session: Session) => void;
  removeShowWatchlist: (show: Show, session: Session) => void;
  addEpisodeWatched: (
    show: ShowWatched,
    episode: Episode,
    session: Session,
  ) => void;
  removeEpisodeWatched: (
    show: ShowWatched,
    episode: Episode,
    session: Session,
  ) => void;
  addSeasonWatched: (
    show: ShowWatched,
    season: Season,
    session: Session,
  ) => void;
  removeSeasonWatched: (
    show: ShowWatched,
    season: Season,
    session: Session,
  ) => void;
}
export const dispatchFunctions = (
  state: IState,
  dispatch: (action: Action) => void,
): IDispatchFunctions => {
  const firstLoad = load(dispatch);

  const addMovieWatched = async (movie: Movie, session: Session) => {
    const { data } = await addWatchedApi(movie, session, 'movie');
    if (data.added.movies) {
      dispatch({ type: 'REMOVE_WATCHLIST_MOVIE', payload: movie });
      dispatch({
        type: 'ADD_WATCHED_MOVIE',
        payload: { movie, type: 'movie', watched_at: new Date().toISOString() },
      });
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
        payload: {
          movie,
          type: 'movie',
          listed_at: new Date().toISOString(),
        } as MovieWatchlist,
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
      dispatch({ type: 'REMOVE_WATCHED_SHOW', payload: show });
      dispatch({
        type: 'ADD_WATCHLIST_SHOW',
        payload: { show, type: 'show', listed_at: new Date().toISOString() },
      });
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

  const addEpisodeWatched = async (
    show: ShowWatched,
    episode: Episode,
    session: Session,
  ) => {
    const { data } = await addWatchedApi(episode, session, 'episode');
    if (data.added.episodes) {
      const { data } = await getProgressApi(session, show.show.ids.trakt);
      dispatch({ type: 'REMOVE_WATCHLIST_SHOW', payload: show.show });
      dispatch({
        type: 'UPDATE_SHOW_PROGRESS',
        payload: {
          show: show,
          progress: data,
        },
      });
    }
  };

  const removeEpisodeWatched = async (
    show: ShowWatched,
    episode: Episode,
    session: Session,
  ) => {
    const { data } = await removeWatchedApi(episode, session!, 'episode');
    if (data.deleted.episodes) {
      const { data } = await getProgressApi(session, show.show.ids.trakt);
      if (!data.last_episode) {
        dispatch({ type: 'REMOVE_WATCHED_SHOW', payload: show.show });
      } else {
        dispatch({
          type: 'UPDATE_SHOW_PROGRESS',
          payload: {
            show: show,
            progress: data,
          },
        });
      }
    }
  };

  const addSeasonWatched = async (
    show: ShowWatched,
    season: Season,
    session: Session,
  ) => {
    const { data } = await addWatchedApi(season, session!, 'season');
    if (data.added.episodes) {
      const { data } = await getProgressApi(session, show.show.ids.trakt);
      dispatch({ type: 'REMOVE_WATCHLIST_SHOW', payload: show.show });
      dispatch({
        type: 'UPDATE_SHOW_PROGRESS',
        payload: {
          show: show,
          progress: data,
        },
      });
    }
  };

  const removeSeasonWatched = async (
    show: ShowWatched,
    season: Season,
    session: Session,
  ) => {
    const { data } = await removeWatchedApi(season, session!, 'season');
    if (data.deleted.episodes) {
      const { data } = await getProgressApi(session, show.show.ids.trakt);
      if (!data.last_episode) {
        dispatch({ type: 'REMOVE_WATCHED_SHOW', payload: show.show });
      } else {
        dispatch({
          type: 'UPDATE_SHOW_PROGRESS',
          payload: {
            show: show,
            progress: data,
          },
        });
      }
    }
  };

  return {
    firstLoad,
    addMovieWatched,
    removeMovieWatched,
    addMovieWatchlist,
    removeMovieWatchlist,
    addShowWatchlist,
    removeShowWatchlist,
    addEpisodeWatched,
    removeEpisodeWatched,
    addSeasonWatched,
    removeSeasonWatched,
  };
};
