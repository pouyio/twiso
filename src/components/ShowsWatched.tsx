import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import UserContext from '../utils/UserContext';
import PaginationContainer from './Pagination/PaginationContainer';
import usePagination from '../utils/usePagination';
import { ShowWatched } from '../models';

const ShowsWatched: React.FC = () => {
  const [shows, setShows] = useState<ShowWatched[]>([]);
  const { userInfo, PAGE_SIZE } = useContext(UserContext);
  const { currentPage } = usePagination(shows);

  useEffect(() => {
    setShows(userInfo.shows.watched);
  }, [userInfo.shows.watched]);

  const getShowsByPage = (page: number) =>
    shows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PaginationContainer items={shows}>
        <ul className="flex flex-wrap p-2 items-stretch justify-center">
          {getShowsByPage(currentPage).map(m => (
            <li
              key={m.show.ids.trakt}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '10em' }}
            >
              <ImageLink
                item={m.show}
                ids={m.show.ids}
                text={m.show.title}
                style={{ minHeight: '13.5em' }}
                type="show"
              />
            </li>
          ))}
        </ul>
      </PaginationContainer>
    </div>
  );
};

export default ShowsWatched;
