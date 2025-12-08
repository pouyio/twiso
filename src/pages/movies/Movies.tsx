import React from 'react';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';
import { Underline } from '../shows/Shows';
import { Icon } from '../../components/Icon';
import { useSearchParams } from 'react-router';
import { useTranslate } from '../../hooks/useTranslate';
import db, { USER_MOVIES_TABLE } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams({
    mode: 'watchlist',
  });
  const mode = searchParams.get('mode');

  const watchlist = useLiveQuery(() =>
    db[USER_MOVIES_TABLE].where({ status: 'watchlist' }).count()
  );
  const watched = useLiveQuery(() =>
    db[USER_MOVIES_TABLE].where({ status: 'watched' }).count()
  );

  const { t } = useTranslate();

  return (
    <>
      <title>Movies</title>
      <div className="flex w-full text-gray-600 lg:max-w-xl lg:m-auto pt-[env(safe-area-inset-top)]">
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
