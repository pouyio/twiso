import React, { useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from 'components/EmptyState';
import { NoResults } from 'components/NoResults';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { DETAIL_SHOWS_TABLE, USER_SHOWS_TABLE } from 'utils/db';
import { Show } from 'models/Show';

const ShowsWatched: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);

  const orderedUserShows = useLiveQuery(
    () =>
      db[USER_SHOWS_TABLE].where('status')
        .equals('watched')
        .reverse()
        .sortBy('created_at'),
    [],
    []
  );

  const fullShows = useLiveQuery(
    () =>
      db[DETAIL_SHOWS_TABLE].where('ids.imdb')
        .anyOf(
          orderedUserShows.filter((s) => !s.hidden).map((us) => us.show_imdb)
        )
        .and((show) => genres.every((g) => show.genres.includes(g)))
        .toArray(),
    [genres, orderedUserShows],
    []
  );

  const orderedShows: Show[] = orderedUserShows
    .map((m) => fullShows.find((fm) => fm.ids.imdb === m.show_imdb))
    .filter(Boolean) as Show[];

  const { getItemsByPage } = usePagination(orderedShows);

  const isHidden = (id: string) => {
    return orderedUserShows.find((ous) => ous.show_imdb === id)?.hidden;
  };

  return !genres.length && !orderedShows.length ? (
    <EmptyState />
  ) : (
    <PaginationContainer items={orderedShows} onFilter={setGenres}>
      {genres.length && !orderedShows.length ? (
        <NoResults />
      ) : (
        <ul className="flex flex-wrap p-2 items-stretch justify-center select-none">
          {getItemsByPage().map((m) => (
            <li
              key={m.ids.trakt}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '10em' }}
            >
              <ImageLink
                ids={m.ids}
                text={m.title}
                style={{ minHeight: '13.5em' }}
                type="show"
                forceState="watched"
                hidden={isHidden(m.ids.imdb)}
              />
            </li>
          ))}
        </ul>
      )}
    </PaginationContainer>
  );
};

export default ShowsWatched;
