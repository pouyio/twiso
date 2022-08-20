import React from 'react';
import Emoji from '../../components/Emoji';
import ShowsWatchlist from './ShowsWatchlist';
import ShowsWatched from './ShowsWatched';
import Helmet from 'react-helmet';
import { useAppSelector } from 'state/store';
import { useTranslate, useWindowSize } from '../../hooks';
import { totalByType } from 'state/slices/shows';
import { motion } from 'framer-motion';
import { useSearchParams } from 'hooks';

export const Underline: React.FC<{ selected: boolean }> = ({ selected }) => {
  return (
    <div className="border-b-2 border-transparent h-0.5 w-full">
      {selected && (
        <motion.div
          layoutId="underline-tab"
          className="bg-blue-300 h-0.5 w-full"
        />
      )}
    </div>
  );
};

export default function Shows() {
  const [searchParams, setSearchParams] = useSearchParams({ mode: 'watched' });
  const mode = searchParams.get('mode');
  const { width } = useWindowSize();

  const { watched, watchlist } = useAppSelector(totalByType);
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
        <div className="w-full">
          <button
            className="py-2 w-full"
            onClick={() => setSearchParams({ mode: 'watchlist' })}
          >
            <Emoji emoji="⏱" /> {t('watchlists')} ({watchlist})
          </button>
          <Underline selected={mode === 'watchlist'} />
        </div>
        <div className="w-full">
          <button
            className="py-2 w-full"
            onClick={() => setSearchParams({ mode: 'watched' })}
          >
            <Emoji emoji="📚" /> {t('show_watcheds')} ({watched})
          </button>
          <Underline selected={mode === 'watched'} />
        </div>
      </div>
      <div className="py-3">
        {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
      </div>
    </>
  );
}
