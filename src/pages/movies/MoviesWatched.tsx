import { MovieWatched } from 'models';
import React, { useEffect, useState } from 'react';
import { filterByGenres } from 'state/slices/movies';
import { useAppSelector } from 'state/store';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';
import { EmptyState } from 'components/EmptyState';

export const MoviesWatched: React.FC = () => {
  const [orderedMovies, setOrderedMovies] = useState<MovieWatched[]>([]);
  const { getItemsByPage } = usePagination(orderedMovies);
  const [genres, setGenres] = useState<string[]>([]);
  const { watched } = useAppSelector(filterByGenres(genres));

  useEffect(() => {
    const newItems = watched
      .map((m) => m)
      .sort((a, b) =>
        new Date(a.watched_at) < new Date(b.watched_at) ? 1 : -1
      );
    setOrderedMovies(newItems);
  }, [watched]);

  return orderedMovies.length ? (
    <PaginationContainer items={orderedMovies} onFilter={setGenres}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getItemsByPage().map((m, i) => (
          <li
            key={`${m.movie.ids.trakt}_${i}`}
            className="p-2"
            style={{ flex: '1 0 50%', maxWidth: '10em' }}
          >
            <ImageLink
              item={m.movie}
              ids={m.movie.ids}
              text={m.movie.title}
              style={{ minHeight: '13.5em' }}
              type="movie"
            />
          </li>
        ))}
      </ul>
    </PaginationContainer>
  ) : (
    <EmptyState />
  );
};
