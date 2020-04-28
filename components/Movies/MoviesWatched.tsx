import React, { useEffect, useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';
import { MovieWatched } from '../../models';

interface IMoviesWatchedProps {
  movies: MovieWatched[];
}

export const MoviesWatched: React.FC<IMoviesWatchedProps> = ({ movies }) => {
  const { getItemsByPage } = usePagination(movies);
  const [orderedMovies, setOrderedMovies] = useState<MovieWatched[]>([]);

  useEffect(() => {
    const newItems = movies.sort((a, b) =>
      new Date(a.watched_at) < new Date(b.watched_at) ? 1 : -1,
    );
    setOrderedMovies(newItems);
  }, [movies]);

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
