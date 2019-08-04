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
        <div className="flex justify-around my-8">
            {isWatched() ?
                <button className="bg-green-400 py-3 px-12 rounded-full text-white font-bold" onClick={() => removeMovieWatched(item)}>
                    ✓ Vista</button>
                : <button className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-thin" onClick={() => addMovieWatched(item)}>
                    Vista</button>}
            {isWatchlist() ?
                <button className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold" onClick={() => removeMovieWatchlist(item)}>
                    Pendiente</button>
                : <button className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-thin" onClick={() => addMovieWatchlist(item)}>
                    Pendiente</button>}
        </div>
    )
}