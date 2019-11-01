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
  MovieWatched,
  ShowWatched,
  Movie,
  Show,
  ShowProgress,
  ItemType,
  ImgConfig,
} from '../models';

export const PAGE_SIZE = 40;

const MOVIE = 'movie';
const SHOW = 'show';

interface SortableShow {
  watched: ShowProgress;
  item: ShowWatched;
}

const sortShowsWatched = (a: SortableShow, b: SortableShow) => {
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
  config: ImgConfig | boolean;
  language: string;
  globalError: boolean;
  addMovieWatched: (item: Movie) => void;
  removeMovieWatched: (item: Movie) => void;
  addMovieWatchlist: (item: Movie) => void;
  addShowWatchlist: (item: Show) => void;
  removeMovieWatchlist: (item: Movie) => void;
  removeShowWatchlist: (item: Show) => void;
  isWatched: (id: number, type: 'movie' | 'show') => boolean;
  isWatchlist: (id: number, type: 'movie' | 'show') => boolean;
  showUpdated: (show: Show) => void;
  removeWatchlistShow: (items: Show[]) => void;
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
  removeWatchlistShow: () => {},
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
  const [config, setConfig] = useState<ImgConfig | boolean>(false);
  const [language] = useState('es');
  const { session } = useContext(AuthContext);

  useEffect(() => {
    getImgsConfigApi().then(({ data }) => {
      setConfig(data);
    });
  }, []);

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

  const removeWatchlistMovie = (items: Movie[]) => {
    const oldItems = userInfo.movies.watchlist.filter(
      om => !items.some(m => m.ids.trakt === om.movie.ids.trakt),
    );
    setUserInfo(prev => {
      prev.movies.watchlist = [...oldItems];
      return { ...prev };
    });
  };

  const removeWatchlistShow = (items: Show[]) => {
    const oldItems = userInfo.shows.watchlist.filter(
      om => !items.some(m => m.ids.trakt === om.show.ids.trakt),
    );
    setUserInfo(prev => {
      prev.shows.watchlist = [...oldItems];
      return { ...prev };
    });
  };

  const removeWatchedMovie = (items: Movie[]) => {
    const oldItems = userInfo.movies.watched;
    const newItems = oldItems.filter(
      om => !items.some(m => m.ids.trakt === om.movie.ids.trakt),
    );
    setUserInfo(prev => {
      prev.movies.watched = [...newItems];
      return { ...prev };
    });
  };

  const removeWatchedShow = (items: Show[]) => {
    const oldItems = userInfo.shows.watched;
    const newItems = oldItems.filter(
      om => !items.some(m => m.ids.trakt === om.show.ids.trakt),
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

    getWatchedApi<MovieWatched>(session, MOVIE)
      .then(({ data }) => setWatchedMovie(data))
      .catch(data => setGlobalError(data));

    getWatchlistApi<MovieWatchlist>(session, MOVIE)
      .then(({ data }) => setWatchlistMovie(data))
      .catch(data => setGlobalError(data));

    getWatchedApi<ShowWatched>(session, SHOW)
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
          setWatchedShow(orderedShows);
        });
      })
      .catch(data => setGlobalError(data));

    getWatchlistApi<ShowWatchlist>(session, SHOW)
      .then(({ data }) => setWatchlistShow(data))
      .catch(data => setGlobalError(data));
  }, [session]);

  const addMovieWatched = (item: Movie) => {
    addWatchedApi(item, session!, MOVIE).then(({ data }) => {
      if (data.added.movies) {
        setWatchedMovie([
          { movie: item, type: 'movie', watched_at: new Date().toISOString() },
        ]);
        removeWatchlistMovie([item]);
      }
    });
  };
  const removeMovieWatched = (item: Movie) => {
    removeWatchedApi(item, session!, MOVIE).then(({ data }) => {
      if (data.deleted.movies) {
        removeWatchedMovie([item]);
      }
    });
  };

  const addMovieWatchlist = (item: Movie) => {
    addWatchlistApi(item, session!, MOVIE).then(({ data }) => {
      if (data.added.movies) {
        setWatchlistMovie([{ movie: item, type: 'movie' } as MovieWatchlist]);
        removeWatchedMovie([item]);
      }
    });
  };

  const addShowWatchlist = (item: Show) => {
    addWatchlistApi(item, session!, SHOW).then(({ data }) => {
      if (data.added.shows) {
        setWatchlistShow([{ show: item, type: 'show' }]);
        removeWatchedShow([item]);
      }
    });
  };
  const removeMovieWatchlist = (item: Movie) => {
    removeWatchlistApi(item, session!, MOVIE).then(({ data }) => {
      if (data.deleted.movies) {
        removeWatchlistMovie([item]);
      }
    });
  };
  const removeShowWatchlist = (item: Show) => {
    removeWatchlistApi(item, session!, SHOW).then(({ data }) => {
      if (data.deleted.shows) {
        removeWatchlistShow([item]);
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
        removeWatchlistShow,
        PAGE_SIZE,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
