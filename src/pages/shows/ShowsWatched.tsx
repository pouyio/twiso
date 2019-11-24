import React, { useState, useEffect } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { useGlobalState } from '../../state/store';
import { ShowWatched } from 'models';

const ShowsWatched: React.FC = () => {
  const [orderedShows, setOrderedShows] = useState<ShowWatched[]>([]);
  const {
    state: {
      userInfo: {
        shows: { watched },
      },
    },
  } = useGlobalState();
  const { getItemsByPage } = usePagination(orderedShows);

  useEffect(() => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 7);
    const newItems = watched.sort((a, b) =>
      new Date(a.last_watched_at) < new Date(b.last_watched_at) ? 1 : -1,
    );
    setOrderedShows(newItems);
  }, [watched]);

  return (
    <div>
      <PaginationContainer items={orderedShows}>
        <ul className="flex flex-wrap p-2 items-stretch justify-center">
          {getItemsByPage().map(m => (
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
