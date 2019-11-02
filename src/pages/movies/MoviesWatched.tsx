import React, { useEffect, useState, useContext } from 'react';
import ImageLink from '../../components/ImageLink';
import UserContext from '../../utils/UserContext';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { MovieWatched } from '../../models';

const MoviesWatched: React.FC = () => {
  const [movies, setMovies] = useState<MovieWatched[]>([]);
  const { userInfo, globalError, PAGE_SIZE } = useContext(UserContext);
  const { currentPage } = usePagination(movies);

  useEffect(() => {
    setMovies(userInfo.movies.watched);
  }, [userInfo.movies.watched]);

  const getMoviesByPage = (page: number) =>
    movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {globalError && (
        <div>
          <pre className="overflow-scroll text-xs text-red-700 whitespace-pre-wrap">
            {JSON.stringify(globalError)}
          </pre>
        </div>
      )}
      <PaginationContainer items={movies}>
        <ul className="flex flex-wrap p-2 items-stretch justify-center">
          {getMoviesByPage(currentPage).map((m, i) => (
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
    </div>
  );
};

export default MoviesWatched;