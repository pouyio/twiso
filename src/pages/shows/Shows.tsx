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
import ShowsWatched from './ShowsWatched';
import ShowsWatchlist from './ShowsWatchlist';

export default function Shows() {
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(StringParam, 'watched')
  );
  // eslint-disable-next-line
  const [_, setCurrentPage] = useQueryParam(
    'page',
    withDefault(NumberParam, 1)
  );
  const { width } = useWindowSize();

  const totalWatched = useAppSelector(
    (state) => Object.keys(state.shows.watched).length
  );
  const totalWatchlist = useAppSelector(
    (state) => Object.keys(state.shows.watchlist).length
  );

  const { t } = useTranslate();

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
          <Emoji emoji="📚" /> {t('show_watcheds')} ({totalWatched})
        </button>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
      </div>
    </>
  );
}
