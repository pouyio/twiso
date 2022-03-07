import React from 'react';
import Helmet from 'react-helmet';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import Emoji from '../../components/Emoji';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';
import { useTranslate, useWindowSize } from '../../hooks';
import { useAppSelector } from 'state/store';
import { totalByType } from 'state/slices/movies';
import { Underline } from '../shows/Shows';

export default function Movies() {
  const [mode, setMode] = useQueryParam(
    'mode',
    withDefault(StringParam, 'watchlist')
  );
  const { width } = useWindowSize();

  const { watched, watchlist } = useAppSelector(totalByType);
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
        <div className="w-full">
          <button className="py-2 w-full" onClick={() => setMode('watchlist')}>
            <Emoji emoji="⏱" /> {t('watchlists')} ({watchlist})
          </button>
          <Underline selected={mode === 'watchlist'} />
        </div>
        <div className="w-full">
          <button className="py-2 w-full" onClick={() => setMode('watched')}>
            <Emoji emoji="📚" /> {t('watcheds')} ({watched})
          </button>
          <Underline selected={mode === 'watched'} />
        </div>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <MoviesWatchlist /> : <MoviesWatched />}
      </div>
    </>
  );
}
