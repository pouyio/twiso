import React, { useEffect, useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';
import { MovieWatched } from 'models';
import { useAppSelector } from 'state/store';
import { byType } from 'state/slices/movies';

export const MoviesWatched: React.FC = () => {
  const [orderedMovies, setOrderedMovies] = useState<MovieWatched[]>([]);
  const { getItemsByPage } = usePagination(orderedMovies);
  const { watched } = useAppSelector(byType);

  useEffect(() => {
    const newItems = watched
      .map((m) => m)
      .sort((a, b) =>
        new Date(a.watched_at) < new Date(b.watched_at) ? 1 : -1
      );
    setOrderedMovies(newItems);
  }, [watched]);

  return (
    <PaginationContainer items={orderedMovies}>
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
  );
};
