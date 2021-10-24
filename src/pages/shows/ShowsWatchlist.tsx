import Emoji from 'components/Emoji';
import { ShowWatchlist } from 'models';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'state/store';
import { getWatchlistApi } from 'utils/api';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks';

const isReleased = (episodes: number) => {
  return episodes > 0;
};

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
            className="p-2 relative"
            style={{ flex: '1 0 50%', maxWidth: '10em' }}
          >
            {isReleased(m.show.aired_episodes) ? null : (
              <Emoji
                emoji="🔜"
                className="absolute top-0 right-0 bg-white rounded-full px-1"
              />
            )}
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
