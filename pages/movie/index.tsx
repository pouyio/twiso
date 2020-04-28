import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Emoji from '../../components/Emoji';
import { MoviesWatched } from '../../components/Movies/MoviesWatched';
import { MoviesWatchlist } from '../../components/Movies/MoviesWatchlist';
import { useGlobalState } from '../../state/store';

export default function Movies() {
  const {
    state: {
      userInfo: { movies },
    },
  } = useGlobalState();

  const {
    query: { mode },
    push,
    pathname,
  } = useRouter();

  useEffect(() => {
    if (!mode) {
      push({ pathname, query: { mode: 'watchlist' } });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Movies</title>
      </Head>
      <div
        className="flex w-full text-gray-600 lg:max-w-xl lg:m-auto"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watchlist' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => push({ pathname, query: { mode: 'watchlist' } })}
        >
          <Emoji emoji="⏱" /> Pendientes ({movies.watchlist.length})
        </button>
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => push({ pathname, query: { mode: 'watched' } })}
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
