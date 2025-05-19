import React, { useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from 'components/EmptyState';
import { NoResults } from 'components/NoResults';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { USER_MOVIES_TABLE } from 'utils/db';

export const MoviesWatched: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const orderedMovies = useLiveQuery(
    () => {
      return db
        .table(USER_MOVIES_TABLE)
        .where('status')
        .equals('completed')
        .reverse()
        .sortBy('last_watched_at');
    },
    [],
    []
  );

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
                ids={m.movie.ids}
                text={m.movie.title}
                style={{ minHeight: '13.5em' }}
                type="movie"
                forceState="completed"
              />
            </li>
          ))}
        </ul>
      )}
    </PaginationContainer>
  );
};
