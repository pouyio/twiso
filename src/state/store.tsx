import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { IDispatchFunctions, dispatchFunctions } from './action';
import { reducer } from './reducer';
import { IState, initialState } from './state';
import { getImgsConfigApi, getWatchedApi, getWatchlistApi } from '../utils/api';
import AuthContext from '../utils/AuthContext';
import {
  MovieWatched,
  MovieWatchlist,
  ShowWatchlist,
  ShowWatched,
} from '../models';

interface IContextProps {
  state: IState;
  actions: IDispatchFunctions;
}
export const Store = createContext<IContextProps>({
  state: initialState,
  actions: dispatchFunctions(initialState, () => {}),
});

export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
  );
  const { session } = useContext(AuthContext);

  useEffect(() => {
    getImgsConfigApi().then(({ data }) => {
      dispatch({ type: 'GET_IMG_CONFIG', payload: data });
    });
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    getWatchedApi<MovieWatched>(session, 'movie')
      .then(({ data }) =>
        dispatch({ type: 'ADD_WATCHED_MOVIES', payload: data }),
      )
      .catch(data => console.error(data));

    getWatchlistApi<MovieWatchlist>(session, 'movie')
      .then(({ data }) =>
        dispatch({ type: 'ADD_WATCHLIST_MOVIES', payload: data }),
      )
      .catch(data => console.error(data));

    getWatchedApi<ShowWatched>(session, 'show')
      .then(({ data }) => {
        dispatch({ type: 'ADD_WATCHED_SHOWS', payload: data });
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

    getWatchlistApi<ShowWatchlist>(session, 'show')
      .then(({ data }) =>
        dispatch({ type: 'ADD_WATCHLIST_SHOWS', payload: data }),
      )
      .catch(data => console.error(data));
  }, [session]);

  return (
    <Store.Provider
      value={{
        state,
        actions: dispatchFunctions(state, dispatch),
      }}
    >
      {children}
    </Store.Provider>
  );
};

export const useGlobalState = () => useContext(Store);
