import React, { useContext } from 'react';
import UserContext from '../utils/UserContext';

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
                    <span role="img" aria-label="emoji">❌</span> Quitar vista</button>
                : <button onClick={() => addMovieWatched(item)}>
                    <span role="img" aria-label="emoji">✅</span> Añadir vista</button>}
            {isWatchlist() ?
                <button onClick={() => removeMovieWatchlist(item)}>
                    <span role="img" aria-label="emoji">❌</span> Quitar pendiente</button>
                : <button onClick={() => addMovieWatchlist(item)}>
                    <span role="img" aria-label="emoji">✅</span> Añadir pendiente</button>}
        </div>
    )
}