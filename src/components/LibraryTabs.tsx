import React from 'react';
import { Underline } from './Underline';
import { Icon } from './Icon';
import { useSearchParams } from 'react-router';
import { useTranslate } from '../hooks/useTranslate';

interface TabConfig {
  icon: 'clock' | 'archive';
  labelKey: string;
  count: number;
}

interface LibraryTabsProps {
  defaultMode: 'watchlist' | 'watched';
  watchedLabelKey: string;
  tabs: {
    watchlist: TabConfig;
    watched: TabConfig;
  };
  children: {
    watchlist: React.ReactNode;
    watched: React.ReactNode;
  };
}

export const LibraryTabs: React.FC<LibraryTabsProps> = ({
  defaultMode,
  watchedLabelKey,
  tabs,
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams({
    mode: defaultMode,
  });
  const mode = searchParams.get('mode') as 'watchlist' | 'watched';

  const { t } = useTranslate();

  const setMode = (newMode: 'watchlist' | 'watched') => {
    setSearchParams({ mode: newMode });
  };

  return (
    <>
      <div className="flex w-full text-gray-600 lg:max-w-xl lg:m-auto pt-[env(safe-area-inset-top)]">
        <div className="w-full">
          <button
            className="py-2 w-full flex justify-center"
            onClick={() => setMode('watchlist')}
          >
            <Icon name={tabs.watchlist.icon} className="px-2 h-6" />{' '}
            {t(tabs.watchlist.labelKey)} ({tabs.watchlist.count})
          </button>
          <Underline selected={mode === 'watchlist'} />
        </div>
        <div className="w-full">
          <button
            className="py-2 w-full flex justify-center"
            onClick={() => setMode('watched')}
          >
            <Icon name={tabs.watched.icon} className="px-2 h-6" />{' '}
            {t(watchedLabelKey)} ({tabs.watched.count})
          </button>
          <Underline selected={mode === 'watched'} />
        </div>
      </div>
      <div className="py-3 lg:max-w-6xl m-auto">
        {mode === 'watchlist' ? children.watchlist : children.watched}
      </div>
    </>
  );
};
