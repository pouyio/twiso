import React, { useState } from 'react';
import { filterByGenres, getHidden } from 'state/slices/shows';
import { useAppSelector } from 'state/store';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from 'components/EmptyState';
import { NoResults } from 'components/NoResults';

const ShowsWatched: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const { watched } = useAppSelector(filterByGenres(genres));
  const hidden = useAppSelector(getHidden);

  const orderedShows = watched.sort((a, b) => {
    if (
      !a.progress?.next_episode ||
      a.progress?.next_episode?.season === 0 ||
      hidden[a.show.ids.trakt]
    ) {
      return 1;
    }
    if (
      !b.progress?.next_episode ||
      b.progress?.next_episode?.season === 0 ||
      hidden[b.show.ids.trakt]
    ) {
      return -1;
    }
    const aDate = new Date(a.progress?.last_watched_at ?? '');
    const bDate = new Date(b.progress?.last_watched_at ?? '');
    return aDate < bDate ? 1 : -1;
  });

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

export default ShowsWatched;
