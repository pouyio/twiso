import React, { useContext, useEffect } from 'react';
import UserContext from '../../utils/UserContext';
import Emoji from '../../components/Emoji';
import ShowsWatchlist from './ShowsWatchlist';
import ShowsWatched from './ShowsWatched';
import { StringParam, useQueryParam } from 'use-query-params';
import Helmet from 'react-helmet';

export default function Shows() {
  const [mode, setMode] = useQueryParam('mode', StringParam);

  const {
    userInfo: { shows },
  } = useContext(UserContext)!;

  useEffect(() => {
    if (!mode) {
      setMode('watched');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="lg:mx-auto">
      <Helmet>
        <title>Shows</title>
      </Helmet>
      <div className="flex w-full pt-2 justify-around border-gray-200 text-gray-600 lg:max-w-xl lg:m-auto">
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
      <div className="py-3">
        {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
      </div>
    </div>
  );
}
