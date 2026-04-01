import React from 'react';
import ShowsWatchlist from './ShowsWatchlist';
import ShowsWatched from './ShowsWatched';
import { Underline } from '../../components/Underline';
import { useTranslate } from '../../hooks/useTranslate';
import { Icon } from '../../components/Icon';
import db, { USER_SHOWS_TABLE } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSearchParams } from 'react-router';

export default function Shows() {
  const [searchParams, setSearchParams] = useSearchParams({
    mode: 'watched',
  });
  const mode = searchParams.get('mode');

  const { t } = useTranslate();

  const watchlist = useLiveQuery(() =>
    db[USER_SHOWS_TABLE].where('status').equals('watchlist').count()
  );
  const watched = useLiveQuery(() =>
    db[USER_SHOWS_TABLE].where('status').equals('watched').count()
  );

  return (
    <>
      <title>Shows</title>
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
            <Icon name="archive" className="px-2 h-6" /> {t('show_watcheds')} (
            {watched})
          </button>
          <Underline selected={mode === 'watched'} />
        </div>
      </div>
      <div className="py-3 lg:max-w-6xl m-auto">
        {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
      </div>
    </>
  );
}
