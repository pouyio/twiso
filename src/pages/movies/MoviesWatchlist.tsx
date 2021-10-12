import React, { useState, useEffect } from 'react';
import ImageLink from 'components/ImageLink';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';
import { MovieWatchlist } from 'models';
import { useAppSelector } from 'state/store';
import { byType } from 'state/slices/movies';
import { motion } from 'framer-motion';

export const MoviesWatchlist: React.FC = () => {
  const [orderedMovies, setOrderedMovies] = useState<MovieWatchlist[]>([]);
  const { getItemsByPage } = usePagination(orderedMovies);
  const { watchlist } = useAppSelector(byType);

  useEffect(() => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 7);
    const newItems = watchlist
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
    setOrderedMovies(newItems);
  }, [watchlist]);

  return (
    <PaginationContainer items={orderedMovies}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getItemsByPage().map((m, i) => (
          <motion.li
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
          </motion.li>
        ))}
      </ul>
    </PaginationContainer>
  );
};
