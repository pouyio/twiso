import React, { useState, useEffect } from 'react';
import ImageLink from 'components/ImageLink';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import usePagination from 'utils/usePagination';
import { useGlobalState } from 'state/store';
import { MovieWatchlist } from 'models';

const MoviesWatchlist: React.FC = () => {
  const [orderedMovies, setOrderedMovies] = useState<MovieWatchlist[]>([]);
  const {
    state: {
      userInfo: {
        movies: { watchlist },
      },
    },
  } = useGlobalState();
  const { getItemsByPage } = usePagination(orderedMovies);

  useEffect(() => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 7);
    const newItems = watchlist
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
    setOrderedMovies(newItems);
  }, [watchlist]);

  return (
    <PaginationContainer items={orderedMovies}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getItemsByPage().map(m => (
          <li
            key={m.movie.ids.trakt}
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

export default MoviesWatchlist;
