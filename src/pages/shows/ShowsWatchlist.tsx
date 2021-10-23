import { ShowWatchlist } from 'models';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'state/store';
import { getWatchlistApi } from 'utils/api';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';

const ShowsWatchlist: React.FC = () => {
  const [orderedShows, setOrderedShows] = useState<ShowWatchlist[]>([]);
  const total = useAppSelector(
    (state) => Object.keys(state.shows.watchlist).length
  );
  const { currentPage } = usePagination(total);

  useEffect(() => {
    getWatchlistApi<ShowWatchlist>('show', currentPage).then((shows) =>
      setOrderedShows(shows.data)
    );
  }, [currentPage]);

  return (
    <PaginationContainer total={total}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {orderedShows.map((m) => (
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
              status="watchlist"
            />
          </li>
        ))}
      </ul>
    </PaginationContainer>
  );
};

export default ShowsWatchlist;
