import React, { useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PosterList from '../../components/PosterList';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from '../../components/EmptyState';
import { NoResults } from '../../components/NoResults';
import { useLiveQuery } from 'dexie-react-hooks';
import db, {
  DBMovieDetail,
  DETAIL_MOVIES_TABLE,
  USER_MOVIES_TABLE,
} from '../../utils/db';
import { Movie } from '../../models/Movie';

export const MoviesWatched: React.FC = () => {
  const [genres, setGenres] = useState<number[]>([]);
  const orderedUserMoviesIds = useLiveQuery(
    () =>
      db[USER_MOVIES_TABLE]
        .where('status')
        .equals('watched')
        .reverse()
        .sortBy('created_at')
        .then((items) => items.map((i) => i.movie_tmdb)),
    [],
    [],
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
    .filter(Boolean) as DBMovieDetail[];

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
              ids={m.ids}
              text={m.title}
              type="movie"
              forceState="watched"
            />
          ))}
        </PosterList>
      )}
    </PaginationContainer>
  );
};
