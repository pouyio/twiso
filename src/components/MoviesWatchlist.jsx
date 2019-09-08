import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import UserContext from '../utils/UserContext';
import PaginationContainer from './PaginationContainer';
import usePagination from '../utils/usePagination';

export default function MoviesWatchlist() {
  const [movies, setMovies] = useState([]);
  const { userInfo, PAGE_SIZE } = useContext(UserContext);
  const { currentPage } = usePagination(movies);

  useEffect(() => {
    setMovies(userInfo.movies.watchlist);
  }, [userInfo.movies.watchlist]);

  const getMoviesByPage = page =>
    movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PaginationContainer items={movies}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getMoviesByPage(currentPage).map(m => (
          <li
            key={m.movie.ids.trakt}
            className="p-2"
            style={{ flex: '1 0 50%', maxWidth: '15em' }}
          >
            <ImageLink item={m} style={{ minHeight: '15em' }} type="movie" />
          </li>
        ))}
      </ul>
    </PaginationContainer>
  );
}
