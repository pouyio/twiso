import React, { useState } from 'react';
import ImageList from '../../components/ImageList';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from '../../components/EmptyState';
import { NoResults } from '../../components/NoResults';
import { Show } from '../../models/Show';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { DETAIL_SHOWS_TABLE, USER_SHOWS_TABLE } from '../../utils/db';

const ShowsWatchlist: React.FC = () => {
  const [genres, setGenres] = useState<number[]>([]);

  const orderedUserShowsIds = useLiveQuery(
    () =>
      db[USER_SHOWS_TABLE]
        .where('status')
        .equals('watchlist')
        .reverse()
        .sortBy('added_to_watchlist_at')
        .then((items) => items.map((i) => i.show_tmdb)),
    [],
    [] as string[],
  );

  const fullShows = useLiveQuery(
    () =>
      db[DETAIL_SHOWS_TABLE]
        .where('ids.tmdb')
        .anyOf(orderedUserShowsIds)
        .and((show) => genres.every((g) => show.genres.includes(g)))
        .toArray(),
    [genres, orderedUserShowsIds],
    [],
  );

  const orderedShows: Show[] = orderedUserShowsIds
    .map((m) => fullShows.find((fm) => fm.ids.tmdb === m))
    .filter(Boolean) as Show[];

  const { getItemsByPage } = usePagination(orderedShows);

  return !genres.length && !orderedShows.length ? (
    <EmptyState />
  ) : (
    <PaginationContainer items={orderedShows} onFilter={setGenres}>
      {genres.length && !orderedShows.length ? (
        <NoResults />
      ) : (
        <ImageList.Container layout="grid">
          {getItemsByPage().map((s) => (
            <ImageList.Link
              key={s.ids.tmdb}
              ids={s.ids}
              text={s.title}
              type="show"
              forceState="watchlist"
            />
          ))}
        </ImageList.Container>
      )}
    </PaginationContainer>
  );
};

export default ShowsWatchlist;
