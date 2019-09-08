import React, { useState, useContext } from 'react';
import UserContext from '../../utils/UserContext';
import Emoji from '../../components/Emoji';
import ShowsWatchlist from '../../components/ShowsWatchlist';
import ShowsWatched from '../../components/ShowsWatched';

export default function Shows() {
  const [mode, setMode] = useState('watched');

  const {
    userInfo: { shows },
  } = useContext(UserContext);

  return (
    <div className="lg:max-w-5xl lg:mx-auto">
      <div className="flex w-full pt-2 justify-around border-b-2 border-gray-200 text-gray-600 mb-3">
        <button
          className={`border-b-2 pb-2 w-full ${
            mode === 'watchlist' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watchlist')}
        >
          <Emoji emoji="⏱" /> Pendientes ({shows.watchlist.length})
        </button>
        <button
          className={`border-b-2 pb-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watched')}
        >
          <Emoji emoji="📚" /> Siguiendo ({shows.watched.length})
        </button>
      </div>
      {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
    </div>
  );
}
