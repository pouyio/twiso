import React from 'react';
import { MoviesWatched } from './MoviesWatched';
import { MoviesWatchlist } from './MoviesWatchlist';
import { LibraryTabs } from '../../components/LibraryTabs';
import db, { USER_MOVIES_TABLE } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Movies() {
  const watchlist = useLiveQuery(() =>
    db[USER_MOVIES_TABLE].where({ status: 'watchlist' }).count()
  );
  const watched = useLiveQuery(() =>
    db[USER_MOVIES_TABLE].where({ status: 'watched' }).count()
  );

  return (
    <>
      <title>Movies</title>
      <LibraryTabs
        defaultMode="watchlist"
        watchedLabelKey="watcheds"
        tabs={{
          watchlist: {
            icon: 'clock',
            labelKey: 'watchlists',
            count: watchlist ?? 0,
          },
          watched: {
            icon: 'archive',
            labelKey: 'watcheds',
            count: watched ?? 0,
          },
        }}
      >
        {{
          watchlist: <MoviesWatchlist />,
          watched: <MoviesWatched />,
        }}
      </LibraryTabs>
    </>
  );
}
