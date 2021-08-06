import React from 'react';
import Helmet from 'react-helmet';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import Emoji from '../../components/Emoji';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';
import { useWindowSize } from '../../hooks';
import { useAppSelector } from 'state/store';
import { totalByType } from 'state/slices/movies';

export default function Movies() {
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(StringParam, 'watchlist')
  );
  const { width } = useWindowSize();

  const { watched, watchlist } = useAppSelector(totalByType);

  return (
    <>
      <Helmet>
        <title>Movies</title>
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
          <Emoji emoji="⏱" /> Pendientes ({watchlist})
        </button>
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watched')}
        >
          <Emoji emoji="📚" /> Vistas ({watched})
        </button>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <MoviesWatchlist /> : <MoviesWatched />}
      </div>
    </>
  );
}
