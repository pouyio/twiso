import React from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { useGlobalState } from '../../state/store';

const MoviesWatched: React.FC = () => {
  const {
    state: {
      PAGE_SIZE,
      userInfo: {
        movies: { watched },
      },
    },
  } = useGlobalState();
  const { currentPage } = usePagination(watched);

  const getMoviesByPage = (page: number) =>
    watched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PaginationContainer items={watched}>
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
