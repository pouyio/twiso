import React from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import usePagination from '../../utils/usePagination';
import { useGlobalState } from '../../state/store';

const ShowsWatched: React.FC = () => {
  const {
    state: {
      PAGE_SIZE,
      userInfo: {
        shows: { watched },
      },
    },
  } = useGlobalState();
  const { currentPage } = usePagination(watched);

  const getShowsByPage = (page: number) =>
    watched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PaginationContainer items={watched}>
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
