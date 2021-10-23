import { MovieWatched } from 'models';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'state/store';
import { getWatchedApi } from 'utils/api';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';

export const MoviesWatched: React.FC = () => {
  const [orderedMovies, setOrderedMovies] = useState<MovieWatched[]>([]);
  const total = useAppSelector(
    (state) => Object.keys(state.movies.watched).length
  );
  const { currentPage } = usePagination(total);

  useEffect(() => {
    getWatchedApi<MovieWatched>('movie', currentPage).then((movies) =>
      setOrderedMovies(movies.data)
    );
  }, [currentPage]);

  return (
    <PaginationContainer total={total}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {orderedMovies.map((m, i) => (
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
