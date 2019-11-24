import { Session } from '../utils/AuthContext';
import { getImgsConfigApi, getWatchedApi, getWatchlistApi } from 'utils/api';
import { Action } from './action';
import db from 'utils/db';
import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';

const load = (dispatch: (action: Action) => void) => (session: Session) => {
  getImgsConfigApi().then(({ data }) => {
    dispatch({ type: 'GET_IMG_CONFIG', payload: data });
  });

  if (!session) {
    return;
  }

  db.table('movies')
    .where({ localState: 'watched' })
    .toArray()
    .then(movies => {
      dispatch({ type: 'SET_WATCHED_MOVIES', payload: movies });
      getWatchedApi<MovieWatched>(session, 'movie')
        .then(({ data }) => {
          dispatch({ type: 'SET_WATCHED_MOVIES', payload: data });
        })
        .catch(data => console.error(data));
    });

  db.table('movies')
    .where({ localState: 'watchlist' })
    .toArray()
    .then(movies => {
      dispatch({ type: 'SET_WATCHLIST_MOVIES', payload: movies });
      getWatchlistApi<MovieWatchlist>(session, 'movie')
        .then(({ data }) => {
          dispatch({ type: 'SET_WATCHLIST_MOVIES', payload: data });
        })
        .catch(data => console.error(data));
    });

  db.table('shows')
    .where({ localState: 'watchlist' })
    .toArray()
    .then(shows => {
      dispatch({ type: 'SET_WATCHLIST_SHOWS', payload: shows });
      getWatchlistApi<ShowWatchlist>(session, 'show')
        .then(({ data }) => {
          dispatch({ type: 'SET_WATCHLIST_SHOWS', payload: data });
        })
        .catch(data => console.error(data));
    });

  db.table('shows')
    .where({ localState: 'watched' })
    .toArray()
    .then(shows => {
      dispatch({ type: 'SET_WATCHED_SHOWS', payload: shows });
      getWatchedApi<ShowWatched>(session, 'show')
        .then(({ data }) => {
          dispatch({ type: 'SET_WATCHED_SHOWS', payload: data });
          // const watchedPromises = data.map(i =>
          //   getProgressApi(session, i.show.ids.trakt),
          // );
          // // TODO only for ordering, avoid all requests somehow
          // Promise.all(watchedPromises).then(res => {
          //   const datas = res.map(r => r.data);
          //   const orderedShows = data
          //     .map((item, index: number) => ({ watched: datas[index], item }))
          //     .sort(sortShowsWatched)
          //     .map(({ item }) => item);
          //   setWatchedShow(orderedShows);
          // });
        })
        .catch(data => console.error(data));
    });
};

export default load;
