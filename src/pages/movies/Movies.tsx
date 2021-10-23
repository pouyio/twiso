import React from 'react';
import Helmet from 'react-helmet';
import { useAppSelector } from 'state/store';
import {
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import Emoji from '../../components/Emoji';
import { useTranslate, useWindowSize } from '../../hooks';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';

export default function Movies() {
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(StringParam, 'watchlist')
  );
  // eslint-disable-next-line
  const [_, setCurrentPage] = useQueryParam(
    'page',
    withDefault(NumberParam, 1)
  );
  const { width } = useWindowSize();
  const totalWatched = useAppSelector(
    (state) => Object.keys(state.movies.watched).length
  );
  const totalWatchlist = useAppSelector(
    (state) => Object.keys(state.movies.watchlist).length
  );

  const { t } = useTranslate();

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
          onClick={() => {
            setCurrentPage(1);
            setMode('watchlist');
          }}
        >
          <Emoji emoji="⏱" /> {t('watchlists')} ({totalWatchlist})
        </button>
        <button
          className={`border-b-2 py-2 w-full ${
            mode === 'watched' ? 'border-blue-300' : 'border-transparent'
          }`}
          onClick={() => {
            setCurrentPage(1);
            setMode('watched');
          }}
        >
          <Emoji emoji="📚" /> {t('watcheds')} ({totalWatched})
        </button>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <MoviesWatchlist /> : <MoviesWatched />}
      </div>
    </>
  );
}
