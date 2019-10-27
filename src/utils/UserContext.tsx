import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  ReactNode,
} from 'react';
import AuthContext from './AuthContext';
import {
  getImgsConfigApi,
  getWatchlistApi,
  addWatchlistApi,
  removeWatchlistApi,
  addWatchedApi,
  removeWatchedApi,
  getWatchedApi,
  getProgressApi,
} from './api';
import {
  MovieWatchlist,
  ShowWatchlist,
  Show,
  MovieWatched,
  ShowWatched,
} from '../models/Item';
import { ItemType } from '../models/ItemType';
import { IImgConfig } from '../models/IImgConfig';

export const PAGE_SIZE = 40;

const MOVIE = 'movie';
const SHOW = 'show';

const sortShowsWatched = (a: any, b: any) => {
  if (a.watched.next_episode === null && b.watched.next_episode === null) {
    return 0;
  }

  if (!a.watched.next_episode) {
    return 1;
  }

  if (!b.watched.next_episode) {
    return -1;
  }

  return 0;
};

interface IUserInfo {
  movies: {
    watched: MovieWatched[];
    watchlist: MovieWatchlist[];
  };
  shows: {
    watched: ShowWatched[];
    watchlist: ShowWatchlist[];
  };
}

interface IUserContext {
  userInfo: IUserInfo;
  config: IImgConfig | boolean;
  language: string;
  globalError: boolean;
  addMovieWatched: (item: MovieWatched) => void;
  removeMovieWatched: (item: MovieWatched) => void;
  addMovieWatchlist: (item: MovieWatchlist) => void;
  addShowWatchlist: (item: ShowWatchlist) => void;
  removeMovieWatchlist: (item: MovieWatchlist) => void;
  removeShowWatchlist: (item: ShowWatchlist) => void;
  isWatched: (id: number, type: 'movie' | 'show') => boolean;
  isWatchlist: (id: number, type: 'movie' | 'show') => boolean;
  showUpdated: (show: Show) => void;
  removeWatchlistLocal: (items: MovieWatchlist[] | ShowWatchlist[]) => void;
  PAGE_SIZE: number;
}

const UserContextDefault: IUserContext = {
  PAGE_SIZE,
  userInfo: {
    movies: {
      watched: [],
      watchlist: [],
    },
    shows: {
      watched: [],
      watchlist: [],
    },
  },
  config: false,
  language: '',
  globalError: false,
  addMovieWatched: () => {},
  removeMovieWatched: () => {},
  addMovieWatchlist: () => {},
  addShowWatchlist: () => {},
  removeMovieWatchlist: () => {},
  removeShowWatchlist: () => {},
  isWatched: () => false,
  isWatchlist: () => false,
  showUpdated: () => {},
  removeWatchlistLocal: () => {},
};

const UserContext = createContext<IUserContext>(UserContextDefault);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>({
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
  const [config, setConfig] = useState<IImgConfig | boolean>(false);
  const [language] = useState('es');
  const { session } = useContext(AuthContext);

  useEffect(() => {
    getImgsConfigApi().then(({ data }) => {
      setConfig(data);
    });
  }, []);

  const setWatched = (items: MovieWatched[] | ShowWatched[]) => {
    const type = items[0].type;
    if (type === MOVIE) {
      setWatchedMovie(items as MovieWatched[]);
    }
    if (type === SHOW) {
      setWatchedShow(items as ShowWatched[]);
    }
  };

  const setWatchedMovie = (items: MovieWatched[]) => {
    setUserInfo(prev => {
      prev.movies.watched = [...items, ...prev.movies.watched];
      return { ...prev };
    });
  };

  const setWatchedShow = (items: ShowWatched[]) => {
    setUserInfo(prev => {
      prev.shows.watched = [...items, ...prev.shows.watched];
      return { ...prev };
    });
  };

  const setWatchlist = (items: MovieWatchlist[] | ShowWatchlist[]) => {
    const type = items[0].type;
    if (type === MOVIE) {
      setWatchlistMovie(items as MovieWatchlist[]);
    }
    if (type === SHOW) {
      setWatchlistShow(items as ShowWatchlist[]);
    }
  };

  const setWatchlistMovie = (items: MovieWatchlist[]) => {
    setUserInfo(prev => {
      const nearFuture = new Date();
      nearFuture.setDate(nearFuture.getDate() + 7);
      const newItems = items
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

      prev.movies.watchlist = [...newItems, ...prev.movies.watchlist];
      return { ...prev };
    });
  };

  const setWatchlistShow = (items: ShowWatchlist[]) => {
    setUserInfo(prev => {
      prev.shows.watchlist = [...items, ...prev.shows.watchlist];
      return { ...prev };
    });
  };

  const removeWatchlist = (items: MovieWatchlist[] | ShowWatchlist[]) => {
    const type = items[0].type;
    if (type === MOVIE) {
      removeWatchlistMovie(items as MovieWatchlist[]);
    }
    if (type === SHOW) {
      removeWatchlistShow(items as ShowWatchlist[]);
    }
  };

  const removeWatchlistMovie = (items: MovieWatchlist[]) => {
    const oldItems = userInfo.movies.watchlist.filter(
      om => !items.some(m => m.movie.ids.trakt === om.movie.ids.trakt),
    );
    setUserInfo(prev => {
      prev.movies.watchlist = [...oldItems];
      return { ...prev };
    });
  };

  const removeWatchlistShow = (items: ShowWatchlist[]) => {
    const oldItems = userInfo.shows.watchlist.filter(
      om => !items.some(m => m.show.ids.trakt === om.show.ids.trakt),
    );
    setUserInfo(prev => {
      prev.shows.watchlist = [...oldItems];
      return { ...prev };
    });
  };

  const removeWatched = (items: MovieWatchlist[] | ShowWatchlist[]) => {
    const type = items[0].type;
    if (type === MOVIE) {
      removeWatchedtMovie(items as MovieWatchlist[]);
    }
    if (type === SHOW) {
      removeWatchedtShow(items as ShowWatchlist[]);
    }
  };

  const removeWatchedtMovie = (items: MovieWatchlist[]) => {
    const oldItems = userInfo.movies.watched;
    const newItems = oldItems.filter(
      om => !items.some(m => m.movie.ids.trakt === om.movie.ids.trakt),
    );
    setUserInfo(prev => {
      prev.movies.watched = [...newItems];
      return { ...prev };
    });
  };

  const removeWatchedtShow = (items: ShowWatchlist[]) => {
    const oldItems = userInfo.shows.watched;
    const newItems = oldItems.filter(
      om => !items.some(m => m.show.ids.trakt === om.show.ids.trakt),
    );
    setUserInfo(prev => {
      prev.shows.watched = [...newItems];
      return { ...prev };
    });
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    getWatchedApi(session, MOVIE)
      .then(({ data }) => setWatched(data))
      .catch(data => setGlobalError(data));

    getWatchlistApi<MovieWatchlist>(session, MOVIE)
      .then(({ data }) => setWatchlist(data))
      .catch(data => setGlobalError(data));

    getWatchedApi(session, SHOW)
      .then(({ data }) => {
        const watchedPromises = data.map(i =>
          getProgressApi(session, i.show.ids.trakt),
        );
        Promise.all(watchedPromises).then(res => {
          const datas = res.map(r => r.data);
          const orderedShows = data
            .map((item, index: number) => ({ watched: datas[index], item }))
            .sort(sortShowsWatched)
            .map(({ item }) => item);
          setWatched(orderedShows);
        });
      })
      .catch(data => setGlobalError(data));

    getWatchlistApi<ShowWatchlist>(session, SHOW)
      .then(({ data }) => setWatchlist(data))
      .catch(data => setGlobalError(data));
  }, [session]);

  const addMovieWatched = (item: MovieWatched) => {
    addWatchedApi(item.movie, session!, MOVIE).then(({ data }) => {
      if (data.added.movies) {
        setWatched([item]);
        removeWatchlist([item]);
      }
    });
  };
  const removeMovieWatched = (item: MovieWatched) => {
    removeWatchedApi(item.movie, session!, MOVIE).then(({ data }) => {
      if (data.deleted.movies) {
        removeWatched([item]);
      }
    });
  };

  const addMovieWatchlist = (item: MovieWatchlist) => {
    addWatchlistApi(item.movie, session!, MOVIE).then(({ data }) => {
      if (data.added.movies) {
        setWatchlist([item]);
        removeWatched([item]);
      }
    });
  };

  const addShowWatchlist = (item: ShowWatchlist) => {
    addWatchlistApi(item.show, session!, SHOW).then(({ data }) => {
      if (data.added.shows) {
        setWatchlist([item]);
        removeWatched([item]);
      }
    });
  };
  const removeMovieWatchlist = (item: MovieWatchlist) => {
    removeWatchlistApi(item.movie, session!, MOVIE).then(({ data }) => {
      if (data.deleted.movies) {
        removeWatchlist([item]);
      }
    });
  };
  const removeShowWatchlist = (item: ShowWatchlist) => {
    removeWatchlistApi(item.show, session!, SHOW).then(({ data }) => {
      if (data.deleted.shows) {
        removeWatchlist([item]);
      }
    });
  };

  const isWatched = (id: number, type: ItemType) => {
    const property = `${type}s` as 'shows' | 'movies';
    return userInfo[property].watched.some(
      (i: any) => i[type].ids.trakt === id,
    );
  };
  const isWatchlist = (id: number, type: ItemType) => {
    const property = `${type}s` as 'shows' | 'movies';
    return userInfo[property].watchlist.some(
      (i: any) => i[type].ids.trakt === id,
    );
  };

  const showUpdated = (show: Show) => {
    const updatedShow = userInfo.shows.watched.find(
      i => i.show.ids.trakt === show.ids.trakt,
    );
    // TODO: only works for shows that are already watched
    // should add new shows too, probably should make a request to progress and then add it.
    if (!updatedShow) {
      return;
    }
    setUserInfo(prev => {
      prev.shows.watched = prev.shows.watched.filter(
        i => i.show.ids.trakt !== show.ids.trakt,
      );
      prev.shows.watched = [updatedShow, ...prev.shows.watched];
      return { ...prev };
    });
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
        showUpdated,
        removeWatchlistLocal: removeWatchlist,
        PAGE_SIZE,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
