import ImageLink from 'components/ImageLink';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import React, { useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from 'components/EmptyState';
import { NoResults } from 'components/NoResults';
import db, { DETAIL_MOVIES_TABLE, USER_MOVIES_TABLE } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Movie } from 'models/Movie';

export const MoviesWatchlist: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const orderedUserMoviesIds = useLiveQuery(
    () =>
      db[USER_MOVIES_TABLE].where('status')
        .equals('watchlist')
        .reverse()
        .sortBy('created_at')
        .then((items) => items.map((i) => i.movie_imdb)),
    [],
    [] as string[]
  );

  const fullMovies = useLiveQuery(
    () =>
      db[DETAIL_MOVIES_TABLE].where('ids.imdb')
        .anyOf(orderedUserMoviesIds)
        .and((movie) => genres.every((g) => movie.genres.includes(g)))
        .toArray(),
    [genres, orderedUserMoviesIds],
    []
  );

  const orderedMovies: Movie[] = orderedUserMoviesIds
    .map((m) => fullMovies.find((fm) => fm.ids.imdb === m))
    .filter(Boolean) as Movie[];

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
              key={`${m.ids.imdb}_${i}`}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '10em' }}
            >
              <ImageLink
                text={m.title}
                ids={m.ids}
                type="movie"
                forceState="watchlist"
              />
            </li>
          ))}
        </ul>
      )}
    </PaginationContainer>
  );
};
