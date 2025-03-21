import React, { useState } from 'react';
import { filterByGenres } from 'state/slices/shows';
import { useAppSelector } from 'state/store';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from 'components/EmptyState';
import { NoResults } from 'components/NoResults';
import { ShowWatchlist } from '../../models/Show';

const ShowsWatchlist: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const { watchlist } = useAppSelector(filterByGenres(genres));

  const nearFuture = new Date();
  nearFuture.setDate(nearFuture.getDate() + 7);
  const orderedShows = Object.values(watchlist)
    .map((s) => s)
    .sort((a, b) => (new Date(a.listed_at!) < new Date(b.listed_at!) ? -1 : 1))
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
  const { getItemsByPage } = usePagination(orderedShows);

  return !genres.length && !orderedShows.length ? (
    <EmptyState />
  ) : (
    <PaginationContainer items={orderedShows} onFilter={setGenres}>
      {genres.length && !orderedShows.length ? (
        <NoResults />
      ) : (
        <ul className="flex flex-wrap p-2 items-stretch justify-center select-none">
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
              />
            </li>
          ))}
        </ul>
      )}
    </PaginationContainer>
  );
};

export default ShowsWatchlist;
