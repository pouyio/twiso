import React, { useContext, useEffect } from 'react';
import MoviesWatchlist from '../../components/MoviesWatchlist';
import MoviesWatched from '../../components/MoviesWatched';
import UserContext from '../../utils/UserContext';
import Emoji from '../../components/Emoji';
import { StringParam, useQueryParam } from 'use-query-params';

export default function Movies() {
  const [mode, setMode] = useQueryParam('mode', StringParam);

  const {
    userInfo: { movies },
  } = useContext(UserContext);

  useEffect(() => {
    if (!mode) {
      setMode('watchlist');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="lg:max-w-5xl lg:mx-auto">
      <div className="flex w-full pt-2 justify-around border-gray-200 text-gray-600">
        <button
          className={`border-b-2 pb-2 w-full ${
            mode === 'watchlist' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watchlist')}
        >
          <Emoji emoji="⏱" /> Pendientes ({movies.watchlist.length})
        </button>
        <button
          className={`border-b-2 pb-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watched')}
        >
          <Emoji emoji="📚" /> Vistas ({movies.watched.length})
        </button>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <MoviesWatchlist /> : <MoviesWatched />}
      </div>
    </div>
  );
}
