import React, { useContext } from 'react';
import UserContext from '../utils/UserContext';

export default function WatchButton({ item }) {
    const { addMovieWatched,
        removeMovieWatched,
        addMovieWatchlist,
        removeMovieWatchlist,
        isWatched,
        isWatchlist
    } = useContext(UserContext);

    return (
        <div className="flex justify-around my-8">
            {isWatched(item.movie.ids.trakt, 'movie') ?
                <button className="bg-green-400 py-3 px-12 rounded-full text-white font-bold" onClick={() => removeMovieWatched(item)}>
                    ✓ Vista</button>
                : <button className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light" onClick={() => addMovieWatched(item)}>
                    Vista</button>}
            {isWatchlist(item.movie.ids.trakt, 'movie') ?
                <button className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold" onClick={() => removeMovieWatchlist(item)}>
                    Pendiente</button>
                : <button className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light" onClick={() => addMovieWatchlist(item)}>
                    Pendiente</button>}
        </div>
    )
}