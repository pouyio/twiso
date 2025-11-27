import { Icon } from 'components/Icon';
import { useParams, useSearchParams } from 'react-router';
import { useTranslate } from 'hooks/useTranslate';
import { Underline } from '../shows/Shows';
import { useEffect, useState } from 'react';
import { getUserMovies } from 'utils/api';
import { MovieStatus } from 'models/Api';
import PaginationContainer from 'components/Pagination/PaginationContainer';
import { NoResults } from 'components/NoResults';
import { usePagination } from 'hooks/usePagination';
import ImageLink from 'components/ImageLink';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams({
    mode: 'watchlist',
  });
  const mode = searchParams.get('mode');
  const { t } = useTranslate();
  const [watchlist, setWatchlist] = useState<MovieStatus[]>([]);
  const [watched, setWatched] = useState<MovieStatus[]>([]);

  useEffect(() => {
    if (id) {
      getUserMovies(id).then(({ data }) => {
        const watchlist = data?.filter((m) => m.status === 'watchlist') ?? [];
        const watched = data?.filter((m) => m.status === 'watched') ?? [];
        setWatched(watched);
        setWatchlist(watchlist);
      });
    }
  }, []);

  const items = mode === 'watchlist' ? watchlist : watched;
  const { getItemsByPage } = usePagination(items);

  return (
    <>
      <title>Movies</title>
      <div className="flex w-full text-gray-600 lg:max-w-xl lg:m-auto pt-[env(safe-area-inset-top)]">
        <div className="w-full">
          <button
            className="py-2 w-full flex justify-center"
            onClick={() => setSearchParams({ mode: 'watchlist' })}
          >
            <Icon name="clock" className="px-2 h-6" /> {t('watchlists')} (
            {watchlist.length})
          </button>
          <Underline selected={mode === 'watchlist'} />
        </div>
        <div className="w-full">
          <button
            className="py-2 w-full flex justify-center"
            onClick={() => setSearchParams({ mode: 'watched' })}
          >
            <Icon name="archive" className="px-2 h-6" /> {t('watcheds')} (
            {watched.length})
          </button>
          <Underline selected={mode === 'watched'} />
        </div>
      </div>
      <div className="py-3">
        <h1>User {id}</h1>
        <PaginationContainer items={items}>
          {!items.length ? (
            <NoResults />
          ) : (
            <ul className="flex flex-wrap p-2 items-stretch justify-center select-none">
              {getItemsByPage().map((m, i) => (
                <li
                  key={`${m.movie_imdb}_${i}`}
                  className="p-2"
                  style={{ flex: '1 0 50%', maxWidth: '10em' }}
                >
                  <ImageLink
                    ids={{
                      imdb: m.movie_imdb,
                    }}
                    text={m.movie_imdb}
                    type="movie"
                    forceState={(mode ?? 'watched') as 'watchlist' | 'watched'}
                  />
                </li>
              ))}
            </ul>
          )}
        </PaginationContainer>
      </div>
    </>
  );
}
