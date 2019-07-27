import React, { createContext, useEffect, useContext, useState } from 'react';
import AuthContext from './AuthContext';
import {
    getImgsConfig,
    getMoviesWatched,
    getMoviesWatchlist,
    addMovieWatchlist as addMWL,
    removeMovieWatchlist as removeMWL,
    addMovieWatched as addMWD,
    removeMovieWatched as removeMWD,
} from './api';

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
    const [config, setConfig] = useState(false);
    const [language] = useState('es');

    useEffect(() => {
        getImgsConfig().then(({ data }) => {
            setConfig(data);
        });
    }, [])

    const { session } = useContext(AuthContext);

    const setMoviesWatched = (movies) => {
        setUserInfo((prev) => {
            prev.movies.watched = [...movies, ...prev.movies.watched];
            return { ...prev };
        });
    }
    const setMoviesWatchlist = (movies) => {
        setUserInfo((prev) => {
            prev.movies.watchlist = [...movies, ...prev.movies.watchlist];
            return { ...prev };
        });
    }

    const removeMoviesWatchlist = (movies) => {
        const oldWL = userInfo.movies.watchlist;
        const newWL = oldWL.filter(om => !movies.some(m => m.movie.ids.trakt === om.movie.ids.trakt));
        setUserInfo((prev) => {
            prev.movies.watchlist = [...newWL];
            return { ...prev };
        });
    }

    const removeMoviesWatched = (movies) => {
        const oldWL = userInfo.movies.watched;
        const newWL = oldWL.filter(om => !movies.some(m => m.movie.ids.trakt === om.movie.ids.trakt));
        setUserInfo((prev) => {
            prev.movies.watched = [...newWL];
            return { ...prev };
        });
    }

    useEffect(() => {
        if (!session) {
            return;
        }
        getMoviesWatched(session).then(({ data }) => setMoviesWatched(data));
        getMoviesWatchlist(session).then(({ data }) => setMoviesWatchlist(data));

    }, [session]);

    const addMovieWatched = (item) => {
        addMWD(item.movie, session).then(({ data }) => {
            if (data.added.movies) {
                setMoviesWatched([item]);
                removeMoviesWatchlist([item]);
            }
        });
    }
    const removeMovieWatched = (item) => {
        removeMWD(item.movie, session).then(({ data }) => {
            if (data.deleted.movies) {
                removeMoviesWatched([item]);
            }
        });
    }

    const addMovieWatchlist = (item) => {
        addMWL(item.movie, session).then(({ data }) => {
            if (data.added.movies) {
                setMoviesWatchlist([item]);
                removeMoviesWatched([item]);
            }
        });
    }
    const removeMovieWatchlist = (item) => {
        removeMWL(item.movie, session).then(({ data }) => {
            if (data.deleted.movies) {
                removeMoviesWatchlist([item]);
            }
        });
    }

    return (
        <UserContext.Provider value={{
            userInfo,
            config,
            language,
            addMovieWatched,
            removeMovieWatched,
            addMovieWatchlist,
            removeMovieWatchlist
        }}>
            {children}
        </UserContext.Provider>
    );
}
export const UserConsumer = UserContext.Consumer;
export default UserContext;