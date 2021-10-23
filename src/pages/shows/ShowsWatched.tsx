import { PaginationContainerOLD } from 'components/Pagination/PaginationContainerOLD';
import { usePaginationOLD } from 'hooks/usePaginationOLD';
import { ShowWatched } from 'models';
import React, { useEffect, useState } from 'react';
import { getWatchedApi } from 'utils/api';
import ImageLink from '../../components/ImageLink';

const ShowsWatched: React.FC = () => {
  const [orderedShows, setOrderedShows] = useState<ShowWatched[]>([]);
  const { getItemsByPage } = usePaginationOLD(orderedShows);

  useEffect(() => {
    getWatchedApi<ShowWatched>('show').then((shows) =>
      setOrderedShows(shows.data)
    );
  }, []);

  return (
    <PaginationContainerOLD items={orderedShows}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getItemsByPage().map((m) => (
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
              status="watched"
            />
          </li>
        ))}
      </ul>
    </PaginationContainerOLD>
  );
};

export default ShowsWatched;
