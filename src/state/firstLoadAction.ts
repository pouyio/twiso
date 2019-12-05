import { Session } from '../utils/AuthContext';
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

const load = (dispatch: (action: Action) => void) => async (
  session: Session | null,
): Promise<boolean> => {
  getImgsConfigApi().then(({ data }) => {
    dispatch({ type: 'GET_IMG_CONFIG', payload: data });
  });

  if (!session) {
    return false;
  }

  try {
    let moviesWatched = await db
      .table<MovieWatched>('movies')
      .where({ localState: 'watched' })
      .toArray();

    dispatch({ type: 'SET_WATCHED_MOVIES', payload: moviesWatched });

    const { data } = await getWatchedApi<MovieWatched>(session, 'movie');
    dispatch({ type: 'SET_WATCHED_MOVIES', payload: data });
  } catch (error) {
    console.error(error);
  }

  try {
    const moviesWatchlist = await db
      .table<MovieWatchlist>('movies')
      .where({ localState: 'watchlist' })
      .toArray();

    dispatch({ type: 'SET_WATCHLIST_MOVIES', payload: moviesWatchlist });
  } catch (error) {
    console.error(error);
  }

  try {
    const showsWatchlist = await db
      .table<ShowWatchlist>('shows')
      .where({ localState: 'watchlist' })
      .toArray();

    dispatch({ type: 'SET_WATCHLIST_SHOWS', payload: showsWatchlist });
  } catch (error) {
    console.error(error);
  }

  try {
    const { data } = await getWatchlistApi(session);
    const moviesReponse = data.filter(
      e => e.type === 'movie',
    ) as MovieWatchlist[];
    const showsReponse = data.filter(e => e.type === 'show') as ShowWatchlist[];
    dispatch({ type: 'SET_WATCHLIST_MOVIES', payload: moviesReponse });
    dispatch({ type: 'SET_WATCHLIST_SHOWS', payload: showsReponse });
  } catch (error) {
    console.error(error);
  }

  try {
    const showsWatched = await db
      .table<ShowWatched>('shows')
      .where({ localState: 'watched' })
      .toArray();
    dispatch({ type: 'SET_WATCHED_SHOWS', payload: showsWatched });

    const { data } = await getWatchedApi<ShowWatched>(session, 'show');
    const showsToUpdate = showsWatched.filter(s => {
      return data.some(
        sd =>
          (s.show.ids.trakt === sd.show.ids.trakt &&
            s.last_updated_at !== sd.last_updated_at) ||
          !s.progress,
      );
    });
    const showsToAdd = data.filter(
      d => !showsWatched.some(s => s.show.ids.trakt === d.show.ids.trakt),
    );
    showsToAdd.forEach(s => dispatch({ type: 'ADD_WATCHED_SHOW', payload: s }));
    const outdatedShows = [...showsToAdd, ...showsToUpdate];
    const showsToDelete = showsWatched.filter(
      s => !data.some(d => d.show.ids.trakt === s.show.ids.trakt),
    );
    dispatch({ type: 'REMOVE_WATCHED_SHOWS', payload: showsToDelete });

    const progressPromises = outdatedShows.map(i =>
      getProgressApi(session, i.show.ids.trakt),
    );
    const progressResponses = await Promise.all(progressPromises);
    const progressData = progressResponses.map(r => r.data);
    progressData.forEach((s, index) => {
      dispatch({
        type: 'UPDATE_SHOW_PROGRESS',
        payload: {
          show: outdatedShows[index],
          progress: s,
        },
      });
    });

    const seasonsPromises = outdatedShows.map(i =>
      getSeasonsApi(i.show.ids.trakt),
    );
    const seasonResponses = await Promise.all(seasonsPromises);
    const seasonsData = seasonResponses.map(r => r.data);
    seasonsData.forEach((s, index) => {
      dispatch({
        type: 'UPDATE_SHOW_SEASONS',
        payload: {
          show: outdatedShows[index],
          seasons: s,
        },
      });
    });
  } catch (error) {
    console.error(error);
  }

  return true;
};

export default load;
