import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import UserContext from '../utils/UserContext';
import PaginationContainer from './Pagination/PaginationContainer';
import usePagination from '../utils/usePagination';
import { MovieWatchlist } from '../models/Movie';

const MoviesWatchlist: React.FC = () => {
  const [movies, setMovies] = useState<MovieWatchlist[]>([]);
  const { userInfo, PAGE_SIZE } = useContext(UserContext);
  const { currentPage } = usePagination(movies);

  useEffect(() => {
    setMovies(userInfo.movies.watchlist);
  }, [userInfo.movies.watchlist]);

  const getMoviesByPage = (page: number) =>
    movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PaginationContainer items={movies}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getMoviesByPage(currentPage).map(m => (
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
