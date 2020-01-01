import { IState } from './state';
import { Action } from './action';

export function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case 'GET_IMG_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_WATCHED_MOVIES': {
      state.userInfo.movies.watched = action.payload;
      return { ...state };
    }
    case 'ADD_WATCHED_MOVIE': {
      const prevMovies = state.userInfo.movies.watched;
      state.userInfo.movies.watched = [action.payload, ...prevMovies];
      return { ...state };
    }
    case 'SET_WATCHLIST_MOVIES': {
      state.userInfo.movies.watchlist = action.payload;
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
    case 'SET_WATCHED_SHOWS': {
      state.userInfo.shows.watched = action.payload;
      return { ...state };
    }
    case 'REMOVE_WATCHED_SHOW': {
      const oldShows = state.userInfo.shows.watched.filter(
        om => action.payload.ids.trakt !== om.show.ids.trakt,
      );
      state.userInfo.shows.watched = [...oldShows];
      return { ...state };
    }
    case 'SET_WATCHLIST_SHOWS': {
      state.userInfo.shows.watchlist = action.payload;
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
    case 'UPDATE_SHOW_PROGRESS': {
      const showIndex = state.userInfo.shows.watched.findIndex(
        s => s.show.ids.trakt === action.payload.show.show.ids.trakt,
      );
      let newShowsWatched;
      if (showIndex === -1) {
        newShowsWatched = [
          ...state.userInfo.shows.watched,
          { ...action.payload.show, progress: action.payload.progress },
        ];
      } else {
        state.userInfo.shows.watched[showIndex] = {
          ...state.userInfo.shows.watched[showIndex],
          progress: action.payload.progress,
        };
        newShowsWatched = [...state.userInfo.shows.watched];
      }
      state.userInfo.shows.watched = newShowsWatched;
      return { ...state };
    }
    case 'UPDATE_SHOW_SEASONS': {
      const showIndex = state.userInfo.shows.watched.findIndex(
        s => s.show.ids.trakt === action.payload.show.show.ids.trakt,
      );
      let newShowsWatched;
      if (showIndex === -1) {
        newShowsWatched = [
          ...state.userInfo.shows.watched,
          { ...action.payload.show, fullSeasons: action.payload.seasons },
        ];
      } else {
        state.userInfo.shows.watched[showIndex] = {
          ...state.userInfo.shows.watched[showIndex],
          fullSeasons: action.payload.seasons,
        };
        newShowsWatched = [...state.userInfo.shows.watched];
      }
      state.userInfo.shows.watched = newShowsWatched;
      return { ...state };
    }
    case 'MOVIES_READY': {
      state.userInfo.movies.ready = true;
      return { ...state };
    }
    case 'SHOWS_READY': {
      state.userInfo.shows.ready = true;
      return { ...state };
    }
    default:
      return state;
  }
}
