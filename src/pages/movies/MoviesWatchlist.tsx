import ImageLink from '../../components/ImageLink';
import PosterList from '../../components/PosterList';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import React, { useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from '../../components/EmptyState';
import { NoResults } from '../../components/NoResults';
import db, { DETAIL_MOVIES_TABLE, USER_MOVIES_TABLE } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Movie } from '../../models/Movie';

export const MoviesWatchlist: React.FC = () => {
  const [genres, setGenres] = useState<number[]>([]);
  const orderedUserMoviesIds = useLiveQuery(
    () =>
      db[USER_MOVIES_TABLE]
        .where('status')
        .equals('watchlist')
        .reverse()
        .sortBy('created_at')
        .then((items) => items.map((i) => i.movie_tmdb)),
    [],
    [] as string[],
  );

  const fullMovies = useLiveQuery(
    () =>
      db[DETAIL_MOVIES_TABLE]
        .where('ids.tmdb')
        .anyOf(orderedUserMoviesIds)
        .and((movie) => genres.every((g) => movie.genres.includes(g)))
        .toArray(),
    [genres, orderedUserMoviesIds],
    [],
  );

  const orderedMovies: Movie[] = orderedUserMoviesIds
    .map((m) => fullMovies.find((fm) => fm.ids.tmdb === m))
    .filter(Boolean) as Movie[];

  const { getItemsByPage } = usePagination(orderedMovies);

  return !genres.length && !orderedMovies.length ? (
    <EmptyState />
  ) : (
    <PaginationContainer items={orderedMovies} onFilter={setGenres}>
      {genres.length && !orderedMovies.length ? (
        <NoResults />
      ) : (
        <PosterList layout="grid">
          {getItemsByPage().map((m, i) => (
            <ImageLink
              key={`${m.ids.tmdb}_${i}`}
              text={m.title}
              ids={m.ids}
              type="movie"
              forceState="watchlist"
            />
          ))}
        </PosterList>
      )}
    </PaginationContainer>
  );
};
