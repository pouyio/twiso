import React, { createContext, useEffect, useContext, useState } from 'react';
import AuthContext from './AuthContext';
import {
  getImgsConfigApi,
  getWatchlistApi,
  addWatchlistApi,
  removeWatchlistApi,
  addWatchedApi,
  removeWatchedApi,
  getWatchedApi,
} from './api';

export const PAGE_SIZE = 36;

const MOVIE = 'movie';
const SHOW = 'show';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    movies: {
      watched: [],
      watchlist: [],
    },
    shows: {
      watched: [],
      watchlist: [],
    },
  });
  const [globalError, setGlobalError] = useState(false);
  const [config, setConfig] = useState(false);
  const [language] = useState('es');

  useEffect(() => {
    getImgsConfigApi().then(({ data }) => {
      setConfig(data);
    });
  }, []);

  const { session } = useContext(AuthContext);

  const setWatched = (items, type) => {
    setUserInfo(prev => {
      prev[`${type}s`].watched = [...items, ...prev[`${type}s`].watched];
      return { ...prev };
    });
  };
  const setWatchlist = (items, type) => {
    setUserInfo(prev => {
      if (type === MOVIE) {
        const nearFuture = new Date();
        nearFuture.setDate(nearFuture.getDate() + 7);
        items = items.reverse().reduce((acc, m) => {
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
      }
      prev[`${type}s`].watchlist = [...items, ...prev[`${type}s`].watchlist];
      return { ...prev };
    });
  };

  const removeWatchlist = (items, type) => {
    const oldItems = userInfo[`${type}s`].watchlist;
    const newItems = oldItems.filter(
      om => !items.some(m => m[type].ids.trakt === om[type].ids.trakt),
    );
    setUserInfo(prev => {
      prev[`${type}s`].watchlist = [...newItems];
      return { ...prev };
    });
  };

  const removeWatched = (items, type) => {
    const oldItems = userInfo[`${type}s`].watched;
    const newItems = oldItems.filter(
      om => !items.some(m => m[type].ids.trakt === om[type].ids.trakt),
    );
    setUserInfo(prev => {
      prev[`${type}s`].watched = [...newItems];
      return { ...prev };
    });
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    getWatchedApi(session, MOVIE)
      .then(({ data }) => setWatched(data, MOVIE))
      .catch(data => setGlobalError(data));

    getWatchlistApi(session, MOVIE)
      .then(({ data }) => setWatchlist(data, MOVIE))
      .catch(data => setGlobalError(data));

    getWatchedApi(session, SHOW)
      .then(({ data }) => setWatched(data, SHOW))
      .catch(data => setGlobalError(data));

    getWatchlistApi(session, SHOW)
      .then(({ data }) => setWatchlist(data, SHOW))
      .catch(data => setGlobalError(data));
  }, [session]);

  const addMovieWatched = item => {
    addWatchedApi(item.movie, session, MOVIE).then(({ data }) => {
      if (data.added.movies) {
        setWatched([item], MOVIE);
        removeWatchlist([item], MOVIE);
      }
    });
  };
  const removeMovieWatched = item => {
    removeWatchedApi(item.movie, session, MOVIE).then(({ data }) => {
      if (data.deleted.movies) {
        removeWatched([item], MOVIE);
      }
    });
  };

  const addMovieWatchlist = item => {
    addWatchlistApi(item.movie, session, MOVIE).then(({ data }) => {
      if (data.added.movies) {
        setWatchlist([item], MOVIE);
        removeWatched([item], MOVIE);
      }
    });
  };

  const addShowWatchlist = item => {
    addWatchlistApi(item.show, session, SHOW).then(({ data }) => {
      if (data.added.shows) {
        setWatchlist([item], SHOW);
        removeWatched([item], SHOW);
      }
    });
  };
  const removeMovieWatchlist = item => {
    removeWatchlistApi(item.movie, session, MOVIE).then(({ data }) => {
      if (data.deleted.movies) {
        removeWatchlist([item], MOVIE);
      }
    });
  };
  const removeShowWatchlist = item => {
    removeWatchlistApi(item.show, session, SHOW).then(({ data }) => {
      if (data.deleted.shows) {
        removeWatchlist([item], SHOW);
      }
    });
  };

  const isWatched = (id, type) => {
    return userInfo[`${type}s`].watched.some(i => i[type].ids.trakt === id);
  };
  const isWatchlist = (id, type) => {
    return userInfo[`${type}s`].watchlist.some(i => i[type].ids.trakt === id);
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        config,
        language,
        globalError,
        addMovieWatched,
        removeMovieWatched,
        addMovieWatchlist,
        addShowWatchlist,
        removeMovieWatchlist,
        removeShowWatchlist,
        isWatched,
        isWatchlist,
        removeWatchlistLocal: removeWatchlist,
        PAGE_SIZE,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
