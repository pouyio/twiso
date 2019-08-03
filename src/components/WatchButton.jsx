import React, { useContext } from 'react';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';

export default function WatchButton({ item }) {
    const { userInfo: {
        movies: { watched, watchlist } },
        addMovieWatched,
        removeMovieWatched,
        addMovieWatchlist,
        removeMovieWatchlist
    } = useContext(UserContext);

    const isWatched = () => {
        if (!item) {
            return false;
        }
        return watched.some(w => w.movie.ids.trakt === item.movie.ids.trakt);
    }

    const isWatchlist = () => {
        if (!item) {
            return false;
        }
        return watchlist.some(w => w.movie.ids.trakt === item.movie.ids.trakt);
    }

    return (
        <div>
            {isWatched() ?
                <button onClick={() => removeMovieWatched(item)}>
                    <Emoji emoji="❌" /> Quitar vista</button>
                : <button onClick={() => addMovieWatched(item)}>
                    <Emoji emoji="✅" /> Añadir vista</button>}
            {isWatchlist() ?
                <button onClick={() => removeMovieWatchlist(item)}>
                    <Emoji emoji="❌" /> Quitar pendiente</button>
                : <button onClick={() => addMovieWatchlist(item)}>
                    <Emoji emoji="✅" /> Añadir pendiente</button>}
        </div>
    )
}