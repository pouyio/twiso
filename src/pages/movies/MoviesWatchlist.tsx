import ImageLink from 'components/ImageLink';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import { MovieWatchlist } from 'models';
import React, { useState } from 'react';
import { filterByGenres } from 'state/slices/movies';
import { useAppSelector } from 'state/store';
import { usePagination } from '../../hooks';
import { EmptyState } from 'components/EmptyState';

export const MoviesWatchlist: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const { watchlist } = useAppSelector(filterByGenres(genres));

  const nearFuture = new Date();
  nearFuture.setDate(nearFuture.getDate() + 7);
  const orderedMovies = watchlist
    .map((m) => m)
    .sort((a, b) => (new Date(a.listed_at) < new Date(b.listed_at) ? -1 : 1))
    .reduce((acc: MovieWatchlist[], m) => {
      if (!m.movie.released) {
        return [...acc, m];
      }
      const released = new Date(m.movie.released);
      if (released < nearFuture) {
        return [m, ...acc];
      } else {
        return [...acc, m];
      }
    }, []);

  const { getItemsByPage } = usePagination(orderedMovies);

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
  ) : (
    <EmptyState />
  );
};
