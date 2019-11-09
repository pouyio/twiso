import React from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { useGlobalState } from '../../state/store';

const MoviesWatchlist: React.FC = () => {
  const {
    state: {
      PAGE_SIZE,
      userInfo: {
        movies: { watchlist },
      },
    },
  } = useGlobalState();
  const { currentPage } = usePagination(watchlist);

  const getMoviesByPage = (page: number) =>
    watchlist.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PaginationContainer items={watchlist}>
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
