import React from 'react';
import Emoji from '../../components/Emoji';
import ShowsWatchlist from './ShowsWatchlist';
import ShowsWatched from './ShowsWatched';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import { IState } from 'state/state';
import { useWindowSize } from '../../hooks';

export default function Shows() {
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(StringParam, 'watched')
  );
  const { width } = useWindowSize();

  const shows = useSelector((state: IState) => state.shows);

  return (
    <>
      <Helmet>
        <title>Shows</title>
      </Helmet>
      <div
        className="flex w-full text-gray-600 lg:max-w-xl lg:m-auto"
        style={{
          ...(width < 1024 ? { paddingTop: 'env(safe-area-inset-top)' } : {}),
        }}
      >
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watchlist' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watchlist')}
        >
          <Emoji emoji="⏱" /> Pendientes ({shows.watchlist.length})
        </button>
        <button
          className={`border-b-2 py-2 w-full ${
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
    </>
  );
}
