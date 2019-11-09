import { IState } from './state';
import { Action } from './action';
import { MovieWatchlist } from '../models';

export function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case 'GET_IMG_CONFIG':
      return { ...state, config: action.payload };
    case 'ADD_WATCHED_MOVIES': {
      const prevMovies = state.userInfo.movies.watched;
      state.userInfo.movies.watched = [...action.payload, ...prevMovies];
      return { ...state };
    }
    case 'ADD_WATCHLIST_MOVIES': {
      const nearFuture = new Date();
      nearFuture.setDate(nearFuture.getDate() + 7);
      const newItems = action.payload
        .reverse()
        .reduce((acc: MovieWatchlist[], m: MovieWatchlist) => {
          if (!m.movie.released) {
            return [...acc, m];
          }
          const released = new Date(m.movie.released);
          if (released < nearFuture) {
            return [m, ...acc];
          } else {
            return [...acc, m];
          }
        }, []);
      state.userInfo.movies.watchlist = [
        ...newItems,
        ...state.userInfo.movies.watchlist,
      ];

      return { ...state };
    }
    case 'ADD_WATCHLIST_MOVIE': {
      const prevMovies = state.userInfo.movies.watchlist;
      state.userInfo.movies.watchlist = [action.payload, ...prevMovies];
      return { ...state };
    }
    case 'REMOVE_WATCHLIST_MOVIE': {
      const oldItems = state.userInfo.movies.watchlist.filter(
        om => om.movie.ids.trakt !== action.payload.ids.trakt,
      );
      state.userInfo.movies.watchlist = [...oldItems];
      return { ...state };
    }
    case 'ADD_WATCHED_SHOWS': {
      const prevShows = state.userInfo.shows.watched;
      state.userInfo.shows.watched = [...action.payload, ...prevShows];
      return { ...state };
    }
    case 'ADD_WATCHLIST_SHOWS': {
      const prevShows = state.userInfo.shows.watchlist;
      state.userInfo.shows.watchlist = [...action.payload, ...prevShows];
      return { ...state };
    }
    case 'ADD_WATCHLIST_SHOW': {
      const prevShows = state.userInfo.shows.watchlist;
      state.userInfo.shows.watchlist = [action.payload, ...prevShows];
      return { ...state };
    }
    case 'REMOVE_WATCHLIST_SHOW': {
      const oldShows = state.userInfo.shows.watchlist.filter(
        om => action.payload.ids.trakt !== om.show.ids.trakt,
      );
      state.userInfo.shows.watchlist = [...oldShows];
      return { ...state };
    }
    case 'REMOVE_WATCHED_MOVIE': {
      const oldItems = state.userInfo.movies.watched.filter(
        om => om.movie.ids.trakt !== action.payload.ids.trakt,
      );
      state.userInfo.movies.watched = [...oldItems];
      return { ...state };
    }
    case 'UPDATE_SHOW': {
      const oldItems = state.userInfo.shows.watched.filter(
        i => i.show.ids.trakt !== action.payload.show.ids.trakt,
      );
      state.userInfo.shows.watched = [action.payload, ...oldItems];
      return { ...state };
    }
    default:
      return state;
  }
}
