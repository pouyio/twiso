import React from 'react';
import Helmet from 'react-helmet';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';
import { useAppSelector } from 'state/store';
import { totalByType } from 'state/slices/movies';
import { Underline } from '../shows/Shows';
import { Icon } from 'components/Icon';
import { useSearchParams } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useTranslate } from '../../hooks/useTranslate';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams({
    mode: 'watchlist',
  });
  const { width } = useWindowSize();
  const mode = searchParams.get('mode');

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
          <button
            className="py-2 w-full flex justify-center"
            onClick={() => setSearchParams({ mode: 'watchlist' })}
          >
            <Icon name="clock" className="px-2 h-6" /> {t('watchlists')} (
            {watchlist})
          </button>
          <Underline selected={mode === 'watchlist'} />
        </div>
        <div className="w-full">
          <button
            className="py-2 w-full flex justify-center"
            onClick={() => setSearchParams({ mode: 'watched' })}
          >
            <Icon name="archive" className="px-2 h-6" /> {t('watcheds')} (
            {watched})
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
