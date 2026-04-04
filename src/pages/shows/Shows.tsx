import React from 'react';
import ShowsWatchlist from './ShowsWatchlist';
import ShowsWatched from './ShowsWatched';
import { LibraryTabs } from '../../components/LibraryTabs';
import db, { USER_SHOWS_TABLE } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Shows() {
  const watchlist = useLiveQuery(() =>
    db[USER_SHOWS_TABLE].where('status').equals('watchlist').count()
  );
  const watched = useLiveQuery(() =>
    db[USER_SHOWS_TABLE].where('status').equals('watched').count()
  );

  return (
    <>
      <title>Shows</title>
      <LibraryTabs
        defaultMode="watched"
        watchedLabelKey="show_watcheds"
        tabs={{
          watchlist: {
            icon: 'clock',
            labelKey: 'watchlists',
            count: watchlist ?? 0,
          },
          watched: {
            icon: 'archive',
            labelKey: 'show_watcheds',
            count: watched ?? 0,
          },
        }}
      >
        {{
          watchlist: <ShowsWatchlist />,
          watched: <ShowsWatched />,
        }}
      </LibraryTabs>
    </>
  );
}
