import { IState } from './state';
import {
  addWatchedApi,
  removeWatchedApi,
  addWatchlistApi,
  removeWatchlistApi,
  getProgressApi,
} from '../utils/api';
import {
  // ImgConfig,
  // MovieWatchlist,
  ShowWatchlist,
  ShowWatched,
  // Movie,
  Show,
  ShowProgress,
  Season,
  Episode,
} from '../models';
import { Session } from '../contexts/AuthContext';
import load from './firstLoadAction';
import { createAction } from '@reduxjs/toolkit';
import { Action } from './action';

// export const getImgConfig = createAction<ImgConfig>('GET_IMG_CONFIG');
export const addWatchlistShow = createAction<ShowWatchlist>(
  'ADD_WATCHLIST_SHOW'
);
export const removeWatchedShow = createAction<Show>('REMOVE_WATCHED_SHOW');
export const removeWatchedShows = createAction<ShowWatched[]>(
  'REMOVE_WATCHED_SHOWS'
);
export const removeWatchlistShow = createAction<Show>('REMOVE_WATCHLIST_SHOW');
export const setWatchedShows = createAction<ShowWatched[]>('SET_WATCHED_SHOWS');
export const addWatchedShow = createAction<ShowWatched>('ADD_WATCHED_SHOW');
// export const setWatchlistShows = createAction<ShowWatchlist[]>(
//   'SET_WATCHLIST_SHOWS'
// );
export const updateShowProgress = createAction<{
  show: ShowWatched;
  progress: ShowProgress;
}>('UPDATE_SHOW_PROGRESS');
export const updateShowSeasons = createAction<{
  show: ShowWatched;
  seasons: Season[];
}>('UPDATE_SHOW_SEASONS');
export const showsReady = createAction('SHOWS_READY');
export const setTotalLoadingShows = createAction<number>(
  'SET_TOTAL_LOADING_SHOWS'
);
export const updateTotalLoadingShows = createAction<number>(
  'UPDATE_TOTAL_LOADING_SHOWS'
);
export const setGlobalSearch = createAction<boolean>('SET_GLOBAL_SEARCH');

export interface IDispatchFunctions {
  firstLoad: (session: Session | null) => Promise<void>;
  addShowWatchlist: (show: Show, session: Session) => void;
  removeShowWatchlist: (show: Show, session: Session) => void;
  addEpisodeWatched: (
    show: ShowWatched,
    episode: Episode,
    session: Session
  ) => void;
  removeEpisodeWatched: (
    show: ShowWatched,
    episode: Episode,
    session: Session
  ) => void;
  addSeasonWatched: (
    show: ShowWatched,
    season: Season,
    session: Session
  ) => void;
  removeSeasonWatched: (
    show: ShowWatched,
    season: Season,
    session: Session
  ) => void;
  setGlobalSearch: (value?: boolean) => void;
}
export const dispatchFunctions = (
  state: IState,
  dispatch: (action: Action) => void
): IDispatchFunctions => {
  const firstLoad = load(dispatch);

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
    session: Session
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
    session: Session
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
    session: Session
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
    session: Session
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

  const setGlobalSearch = (value?: boolean) => {
    dispatch({ type: 'SET_GLOBAL_SEARCH', payload: value });
  };

  return {
    firstLoad,
    addShowWatchlist,
    removeShowWatchlist,
    addEpisodeWatched,
    removeEpisodeWatched,
    addSeasonWatched,
    removeSeasonWatched,
    setGlobalSearch,
  };
};
