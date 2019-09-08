import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import UserContext from '../utils/UserContext';
import PaginationContainer from './PaginationContainer';
import usePagination from '../utils/usePagination';

export default function ShowsWatched() {
  const [shows, setShows] = useState([]);
  const { userInfo, PAGE_SIZE } = useContext(UserContext);
  const { currentPage } = usePagination(shows);

  useEffect(() => {
    setShows(userInfo.shows.watched);
  }, [userInfo.shows.watched]);

  const getShowsByPage = page =>
    shows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PaginationContainer items={shows}>
        <ul className="flex flex-wrap p-2 items-stretch justify-center">
          {getShowsByPage(currentPage).map(m => (
            <li
              key={m.show.ids.trakt}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '15em' }}
            >
              <ImageLink item={m} style={{ minHeight: '15em' }} type="show" />
            </li>
          ))}
        </ul>
      </PaginationContainer>
    </div>
  );
}
