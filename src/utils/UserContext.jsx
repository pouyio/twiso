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

export const PAGE_SIZE = 40;

const MOVIE = 'movie';
const SHOW = 'show';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        movies: {
            watched: [],
            watchlist: []
        },
        shows: {
            watched: [],
            watchlist: []
        }
    });
    const [globalError, setGlobalError] = useState(false);
    const [config, setConfig] = useState(false);
    const [language] = useState('es');

    useEffect(() => {
        getImgsConfigApi().then(({ data }) => {
            setConfig(data);
        });
    }, [])

    const { session } = useContext(AuthContext);

    const setWatched = (items, type) => {
        setUserInfo((prev) => {
            prev[`${type}s`].watched = [...items, ...prev[`${type}s`].watched];
            return { ...prev };
        });
    }
    const setWatchlist = (items, type) => {
        setUserInfo((prev) => {
            prev[`${type}s`].watchlist = [...items, ...prev[`${type}s`].watchlist];
            return { ...prev };
        });
    }

    const removeWatchlist = (items, type) => {
        const oldItems = userInfo[`${type}s`].watchlist;
        const newItems = oldItems.filter(om => !items.some(m => m[type].ids.trakt === om[type].ids.trakt));
        setUserInfo((prev) => {
            prev[`${type}s`].watchlist = [...newItems];
            return { ...prev };
        });
    }

    const removeWatched = (items, type) => {
        const oldItems = userInfo[`${type}s`].watched;
        const newItems = oldItems.filter(om => !items.some(m => m[type].ids.trakt === om[type].ids.trakt));
        setUserInfo((prev) => {
            prev[`${type}s`].watched = [...newItems];
            return { ...prev };
        });
    }

    useEffect(() => {
        if (!session) {
            return;
        }

        getWatchedApi(session, MOVIE)
            .then(({ data }) => setWatched(data, MOVIE))
            .catch((data) => setGlobalError(data));

        getWatchlistApi(session, MOVIE)
            .then(({ data }) => setWatchlist(data, MOVIE))
            .catch((data) => setGlobalError(data));

        getWatchedApi(session, SHOW)
            .then(({ data }) => setWatched(data, SHOW))
            .catch((data) => setGlobalError(data));

        getWatchlistApi(session, SHOW)
            .then(({ data }) => setWatchlist(data, SHOW))
            .catch((data) => setGlobalError(data));

    }, [session]);

    const addMovieWatched = (item) => {
        addWatchedApi(item.movie, session, MOVIE).then(({ data }) => {
            if (data.added.movies) {
                setWatched([item], MOVIE);
                removeWatchlist([item], MOVIE);
            }
        });
    }
    const removeMovieWatched = (item) => {
        removeWatchedApi(item.movie, session, MOVIE).then(({ data }) => {
            if (data.deleted.movies) {
                removeWatched([item], MOVIE);
            }
        });
    }

    const addMovieWatchlist = (item) => {
        addWatchlistApi(item.movie, session, MOVIE).then(({ data }) => {
            if (data.added.movies) {
                setWatchlist([item], MOVIE);
                removeWatched([item], MOVIE);
            }
        });
    }
    const removeMovieWatchlist = (item) => {
        removeWatchlistApi(item.movie, session, MOVIE).then(({ data }) => {
            if (data.deleted.movies) {
                removeWatchlist([item], MOVIE);
            }
        });
    }

    const isMovieWatched = (id) => {
        return userInfo.movies.watched.some(i => i.movie.ids.trakt === id);
    }
    const isMovieWatchlist = (id) => {
        return userInfo.movies.watchlist.some(i => i.movie.ids.trakt === id);
    }

    return (
        <UserContext.Provider value={{
            userInfo,
            config,
            language,
            globalError,
            addMovieWatched,
            removeMovieWatched,
            addMovieWatchlist,
            removeMovieWatchlist,
            isMovieWatched,
            isMovieWatchlist,
            PAGE_SIZE
        }}>
            {children}
        </UserContext.Provider>
    );
}
export default UserContext;