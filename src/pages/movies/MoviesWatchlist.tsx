import ImageLink from 'components/ImageLink';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import React, { useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from 'components/EmptyState';
import { NoResults } from 'components/NoResults';
import db from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const MoviesWatchlist: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const orderedMovies = useLiveQuery(
    () => {
      return db
        .table('movies-s')
        .where('status')
        .equals('plantowatch')
        .reverse()
        .sortBy('added_to_watchlist_at');
    },
    [],
    []
  );

  const nearFuture = new Date();
  nearFuture.setDate(nearFuture.getDate() + 7);

  const { getItemsByPage } = usePagination(orderedMovies);

  return !genres.length && !orderedMovies.length ? (
    <EmptyState />
  ) : (
    <PaginationContainer items={orderedMovies} onFilter={setGenres}>
      {genres.length && !orderedMovies.length ? (
        <NoResults />
      ) : (
        <ul className="flex flex-wrap p-2 items-stretch justify-center select-none">
          {getItemsByPage().map((m, i) => (
            <li
              key={`${m.movie.ids.trakt}_${i}`}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '10em' }}
            >
              <ImageLink
                text={m.movie.title}
                ids={m.movie.ids}
                style={{}}
                type="movie"
              />
            </li>
          ))}
        </ul>
      )}
    </PaginationContainer>
  );
};
