import React, { useEffect, useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { useGlobalState } from '../../state/store';
import { ShowWatchlist } from 'models';

const ShowsWatchlist: React.FC = () => {
  const [orderedShows, setOrderedShows] = useState<ShowWatchlist[]>([]);
  const {
    state: {
      userInfo: {
        shows: { watchlist },
      },
    },
  } = useGlobalState();
  const { getItemsByPage } = usePagination(watchlist);

  useEffect(() => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 7);
    const newItems = watchlist
      .sort((a, b) =>
        new Date(a.listed_at!) < new Date(b.listed_at!) ? -1 : 1,
      )
      .reduce((acc: ShowWatchlist[], m) => {
        if (!m.show.first_aired) {
          return [...acc, m];
        }
        const released = new Date(m.show.first_aired);
        if (released < nearFuture) {
          return [m, ...acc];
        } else {
          return [...acc, m];
        }
      }, []);
    setOrderedShows(newItems);
  }, [watchlist]);

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

export default ShowsWatchlist;
