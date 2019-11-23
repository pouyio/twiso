import React, { useEffect, useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { useGlobalState } from '../../state/store';
import { MovieWatched } from 'models';

const MoviesWatched: React.FC = () => {
  const {
    state: {
      userInfo: {
        movies: { watched },
      },
    },
  } = useGlobalState();
  const { getItemsByPage } = usePagination(watched);
  const [orderedMovies, setOrderedMovies] = useState<MovieWatched[]>([]);

  useEffect(() => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 7);
    const newItems = watched.sort((a, b) =>
      new Date(a.watched_at) < new Date(b.watched_at) ? 1 : -1,
    );
    setOrderedMovies(newItems);
  }, [watched]);

  return (
    <div>
      <PaginationContainer items={orderedMovies}>
        <ul className="flex flex-wrap p-2 items-stretch justify-center">
          {getItemsByPage().map((m, i) => (
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
