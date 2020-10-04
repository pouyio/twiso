import React from 'react';
import Helmet from 'react-helmet';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import Emoji from '../../components/Emoji';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';
import { useSelector } from 'react-redux';
import { IState } from 'state/state';

export default function Movies() {
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(StringParam, 'watchlist')
  );

  const movies = useSelector((state: IState) => state.movies);

  return (
    <>
      <Helmet>
        <title>Movies</title>
      </Helmet>
      <div
        className="flex w-full text-gray-600 lg:max-w-xl lg:m-auto"
        style={{
          ...(window.visualViewport.width <= 1024
            ? { paddingTop: 'env(safe-area-inset-top)' }
            : {}),
        }}
      >
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watchlist' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watchlist')}
        >
          <Emoji emoji="⏱" /> Pendientes ({movies.watchlist.length})
        </button>
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => setMode('watched')}
        >
          <Emoji emoji="📚" /> Vistas ({movies.watched.length})
        </button>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? (
          <MoviesWatchlist movies={movies.watchlist} />
        ) : (
          <MoviesWatched movies={movies.watched} />
        )}
      </div>
    </>
  );
}
