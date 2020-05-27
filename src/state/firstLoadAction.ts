import { Session } from '../contexts/AuthContext';
import {
  getImgsConfigApi,
  getWatchedApi,
  getWatchlistApi,
  getProgressApi,
  getSeasonsApi,
} from 'utils/api';
import { Action } from './action';
import db from 'utils/db';
import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';

const refreshWatchedMovies = async (
  dispatch: (action: Action) => void,
  session: Session
) => {
  const moviesWatched = await db
    .table<MovieWatched>('movies')
    .where({ localState: 'watched' })
    .toArray();

  dispatch({ type: 'SET_WATCHED_MOVIES', payload: moviesWatched });

  getWatchedApi<MovieWatched>(session, 'movie').then(({ data }) => {
    dispatch({ type: 'SET_WATCHED_MOVIES', payload: data });
  });
  return true;
};

const refreshWatchlistMovies = async (
  dispatch: (action: Action) => void,
  session: Session
) => {
  const moviesWatchlist = await db
    .table<MovieWatchlist>('movies')
    .where({ localState: 'watchlist' })
    .toArray();

  dispatch({ type: 'SET_WATCHLIST_MOVIES', payload: moviesWatchlist });

  getWatchlistApi<MovieWatchlist>(session, 'movie').then(({ data }) => {
    dispatch({ type: 'SET_WATCHLIST_MOVIES', payload: data });
  });

  return true;
};

const refreshMovies = (
  dispatch: (action: Action) => void,
  session: Session
) => {
  try {
    return Promise.all([
      refreshWatchedMovies(dispatch, session),
      refreshWatchlistMovies(dispatch, session),
    ]);
  } catch (e) {
    console.error(e);
  }
};

const refreshWatchedShows = async (
  dispatch: (action: Action) => void,
  session: Session
) => {
  const showsWatched = await db
    .table<ShowWatched>('shows')
    .where({ localState: 'watched' })
    .toArray();
  dispatch({ type: 'SET_WATCHED_SHOWS', payload: showsWatched });

  getWatchedApi<ShowWatched>(session, 'show').then(async ({ data }) => {
    const showsToUpdate = showsWatched.filter((s) => {
      return data.some(
        (sd) =>
          !s.progress ||
          (s.show.ids.trakt === sd.show.ids.trakt &&
            s.last_updated_at !== sd.last_updated_at)
      );
    });
    const showsToAdd = data.filter(
      (d) => !showsWatched.some((s) => s.show.ids.trakt === d.show.ids.trakt)
    );
    showsToAdd.forEach((s) =>
      dispatch({ type: 'ADD_WATCHED_SHOW', payload: s })
    );
    const outdatedShows = [...showsToAdd, ...showsToUpdate];

    dispatch({
      type: 'SET_TOTAL_LOADING_SHOWS',
      payload: outdatedShows.length,
    });

    const showsToDelete = showsWatched.filter(
      (s) => !data.some((d) => d.show.ids.trakt === s.show.ids.trakt)
    );
    dispatch({ type: 'REMOVE_WATCHED_SHOWS', payload: showsToDelete });
    dispatch({
      type: 'UPDATE_TOTAL_LOADING_SHOWS',
      payload: showsToDelete.length,
    });

    outdatedShows.forEach(async (outdated) => {
      try {
        const [seasons, progress] = await Promise.all([
          getSeasonsApi(outdated.show.ids.trakt),
          getProgressApi(session, outdated.show.ids.trakt),
        ]);
        dispatch({
          type: 'UPDATE_SHOW_SEASONS',
          payload: {
            show: outdated,
            seasons: seasons.data,
          },
        });
        dispatch({
          type: 'UPDATE_SHOW_PROGRESS',
          payload: {
            show: outdated,
            progress: progress.data,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: 'UPDATE_TOTAL_LOADING_SHOWS' });
      }
    });
  });
};

const refreshWatchlistShows = async (
  dispatch: (action: Action) => void,
  session: Session
) => {
  const showsWatchlist = await db
    .table<ShowWatchlist>('shows')
    .where({ localState: 'watchlist' })
    .toArray();

  dispatch({ type: 'SET_WATCHLIST_SHOWS', payload: showsWatchlist });

  getWatchlistApi<ShowWatchlist>(session, 'show').then(({ data }) =>
    dispatch({ type: 'SET_WATCHLIST_SHOWS', payload: data })
  );
};

const refreshShows = (dispatch: (action: Action) => void, session: Session) => {
  try {
    return Promise.all([
      refreshWatchlistShows(dispatch, session),
      refreshWatchedShows(dispatch, session),
    ]);
  } catch (e) {
    console.error(e);
  }
};

const load = (dispatch: (action: Action) => void) => async (
  session: Session | null
): Promise<void> => {
  getImgsConfigApi().then(({ data }) => {
    dispatch({ type: 'GET_IMG_CONFIG', payload: data });
  });

  if (!session) {
    return;
  }

  refreshMovies(dispatch, session)?.then(() =>
    dispatch({ type: 'MOVIES_READY' })
  );
  refreshShows(dispatch, session)?.then(() =>
    dispatch({ type: 'SHOWS_READY' })
  );
};

export default load;
