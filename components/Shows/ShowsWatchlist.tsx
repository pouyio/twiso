import React, { useEffect, useState } from 'react';
import ImageLink from '../ImageLink';
import PaginationContainer from '../Pagination/PaginationContainer';
import { usePagination } from '../../hooks';
import { useGlobalState } from '../../state/store';
import { ShowWatchlist } from '../../models';
import { TappableLi } from '../Animated/TappableLi';

const ShowsWatchlist: React.FC = () => {
  const [orderedShows, setOrderedShows] = useState<ShowWatchlist[]>([]);
  const {
    state: {
      userInfo: {
        shows: { watchlist },
      },
    },
  } = useGlobalState();
  const { getItemsByPage } = usePagination(orderedShows);

  useEffect(() => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 7);
    const newItems = watchlist
      .sort((a, b) =>
        new Date(a.listed_at!) < new Date(b.listed_at!) ? -1 : 1,
      )
      .reduce((acc: ShowWatchlist[], s) => {
        if (!s.show.first_aired) {
          return [...acc, s];
        }
        const released = new Date(s.show.first_aired);
        if (released < nearFuture) {
          return [s, ...acc];
        } else {
          return [...acc, s];
        }
      }, []);
    setOrderedShows(newItems);
  }, [watchlist]);

  return (
    <PaginationContainer items={orderedShows}>
      <ul className="flex flex-wrap p-2 items-stretch justify-center">
        {getItemsByPage().map((m) => (
          <TappableLi
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
          </TappableLi>
        ))}
      </ul>
    </PaginationContainer>
  );
};

export default ShowsWatchlist;
