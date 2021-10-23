import ImageLink from 'components/ImageLink';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import { usePagination } from 'hooks';
import { MovieWatchlist } from 'models';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'state/store';
import { getWatchlistApi } from 'utils/api';

export const MoviesWatchlist: React.FC = () => {
  const [orderedMovies, setOrderedMovies] = useState<MovieWatchlist[]>([]);
  const total = useAppSelector(
    (state) => Object.keys(state.movies.watchlist).length
  );

  const { currentPage } = usePagination(total);

  useEffect(() => {
    getWatchlistApi<MovieWatchlist>('movie', currentPage).then((movies) =>
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
              text={m.movie.title}
              ids={m.movie.ids}
              item={m.movie}
              style={{ minHeight: '13.5em' }}
              type="movie"
            />
          </li>
        ))}
      </ul>
    </PaginationContainer>
  );
};
