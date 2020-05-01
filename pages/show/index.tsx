import Head from 'next/head';
import React, { useEffect } from 'react';
import Emoji from '../../components/Emoji';
import ShowsWatched from '../../components/Shows/ShowsWatched';
import ShowsWatchlist from '../../components/Shows/ShowsWatchlist';
import { useGlobalState } from '../../state/store';
import { useRouter } from 'next/router';

export default function Shows() {
  const {
    query: { mode },
    push,
    pathname,
  } = useRouter();

  const {
    state: {
      userInfo: {
        shows: { watchlist, watched },
      },
    },
  } = useGlobalState();

  useEffect(() => {
    if (!mode) {
      push({ pathname, query: { mode: 'watched' } });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Shows</title>
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
          <Emoji emoji="⏱" /> Pendientes ({watchlist.length})
        </button>
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => push({ pathname, query: { mode: 'watched' } })}
        >
          <Emoji emoji="📚" /> Siguiendo ({watched.length})
        </button>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
      </div>
    </>
  );
}
