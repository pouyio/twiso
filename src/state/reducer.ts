import { IState } from './state';
import { Action } from './action';

export function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case 'GET_IMG_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_WATCHED_MOVIES': {
      state.movies.watched = action.payload;
      return { ...state };
    }
    case 'ADD_WATCHED_MOVIE': {
      const prevMovies = state.movies.watched;
      state.movies.watched = [action.payload, ...prevMovies];
      return { ...state };
    }
    case 'SET_WATCHLIST_MOVIES': {
      state.movies.watchlist = action.payload;
      return { ...state };
    }
    case 'ADD_WATCHLIST_MOVIE': {
      const prevMovies = state.movies.watchlist;
      state.movies.watchlist = [action.payload, ...prevMovies];
      return { ...state };
    }
    case 'REMOVE_WATCHLIST_MOVIE': {
      const oldItems = state.movies.watchlist.filter(
        (om) => om.movie.ids.trakt !== action.payload.ids.trakt
      );
      state.movies.watchlist = [...oldItems];
      return { ...state };
    }
    case 'SET_WATCHED_SHOWS': {
      state.shows.watched = action.payload;
      return { ...state };
    }
    case 'REMOVE_WATCHED_SHOW': {
      const oldShows = state.shows.watched.filter(
        (om) => action.payload.ids.trakt !== om.show.ids.trakt
      );
      state.shows.watched = [...oldShows];
      return { ...state };
    }
    case 'SET_WATCHLIST_SHOWS': {
      state.shows.watchlist = action.payload;
      return { ...state };
    }
    case 'ADD_WATCHLIST_SHOW': {
      const prevShows = state.shows.watchlist;
      state.shows.watchlist = [action.payload, ...prevShows];
      return { ...state };
    }
    case 'REMOVE_WATCHLIST_SHOW': {
      const oldShows = state.shows.watchlist.filter(
        (om) => action.payload.ids.trakt !== om.show.ids.trakt
      );
      state.shows.watchlist = [...oldShows];
      return { ...state };
    }
    case 'REMOVE_WATCHED_MOVIE': {
      const oldItems = state.movies.watched.filter(
        (om) => om.movie.ids.trakt !== action.payload.ids.trakt
      );
      state.movies.watched = [...oldItems];
      return { ...state };
    }
    case 'UPDATE_SHOW_PROGRESS': {
      const showIndex = state.shows.watched.findIndex(
        (s) => s.show.ids.trakt === action.payload.show.show.ids.trakt
      );
      let newShowsWatched;
      if (showIndex === -1) {
        newShowsWatched = [
          ...state.shows.watched,
          { ...action.payload.show, progress: action.payload.progress },
        ];
      } else {
        state.shows.watched[showIndex] = {
          ...state.shows.watched[showIndex],
          progress: action.payload.progress,
        };
        newShowsWatched = [...state.shows.watched];
      }
      state.shows.watched = newShowsWatched;
      return { ...state };
    }
    case 'UPDATE_SHOW_SEASONS': {
      const showIndex = state.shows.watched.findIndex(
        (s) => s.show.ids.trakt === action.payload.show.show.ids.trakt
      );
      let newShowsWatched;
      if (showIndex === -1) {
        newShowsWatched = [
          ...state.shows.watched,
          { ...action.payload.show, fullSeasons: action.payload.seasons },
        ];
      } else {
        state.shows.watched[showIndex] = {
          ...state.shows.watched[showIndex],
          fullSeasons: action.payload.seasons,
        };
        newShowsWatched = [...state.shows.watched];
      }
      state.shows.watched = newShowsWatched;
      return { ...state };
    }
    case 'MOVIES_READY': {
      state.movies.ready = true;
      return { ...state };
    }
    case 'SHOWS_READY': {
      state.shows.ready = true;
      return { ...state };
    }
    case 'SET_TOTAL_LOADING_SHOWS': {
      state.loading.shows.total = action.payload;
      return { ...state };
    }
    case 'UPDATE_TOTAL_LOADING_SHOWS': {
      state.loading.shows.current =
        action.payload ?? ++state.loading.shows.current;
      return { ...state };
    }
    case 'SET_GLOBAL_SEARCH': {
      return { ...state, globalSearch: !!action.payload };
    }
    default:
      return state;
  }
}
