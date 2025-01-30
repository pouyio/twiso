import React from 'react';
import ShowsWatchlist from './ShowsWatchlist';
import ShowsWatched from './ShowsWatched';
import Helmet from 'react-helmet';
import { useAppSelector } from 'state/store';
import { useTranslate } from '../../hooks/useTranslate';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useSearchParams } from '../../hooks/useSearchParams';
import { totalByType } from 'state/slices/shows';
import { motion } from 'motion/react';
import { Icon } from 'components/Icon';

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
      <div className="py-3">
        {mode === 'watchlist' ? <ShowsWatchlist /> : <ShowsWatched />}
      </div>
    </>
  );
}
