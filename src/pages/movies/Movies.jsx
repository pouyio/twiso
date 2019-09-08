import React, { useState, useContext } from 'react';
import MoviesWatchlist from '../../components/MoviesWatchlist';
import MoviesWatched from '../../components/MoviesWatched';
import UserContext from '../../utils/UserContext';
import Emoji from '../../components/Emoji';

export default function Movies() {
    const [mode, setMode] = useState('watchlist');

    const { userInfo: { movies } } = useContext(UserContext);

    return <>
        <div className="flex w-full pt-2 justify-around border-b-2 border-gray-200 text-gray-600 mb-3">
            <button className={`border-b-2 pb-2 w-full ${mode === 'watchlist' ? 'border-blue-300' : 'border-transparent'}`} onClick={() => setMode('watchlist')}><Emoji emoji="⏱" /> Pendientes ({movies.watchlist.length})</button>
            <button className={`border-b-2 pb-2 w-full ${mode === 'watched' ? 'border-blue-300' : 'border-transparent'}`} onClick={() => setMode('watched')}><Emoji emoji="📚" /> Vistas ({movies.watched.length})</button>
        </div>
        {mode === 'watchlist'
            ? <MoviesWatchlist />
            : <MoviesWatched />
        }
    </>

}