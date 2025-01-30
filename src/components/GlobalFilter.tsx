import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/slices/root';
import { getType } from 'utils/getType';
import Emoji from './Emoji';
import ImageLink from './ImageLink';
import { useFilter } from '../hooks/useFilter';
import { useIsWatch } from '../hooks/useIsWatch';
import { MovieWatched, MovieWatchlist } from '../models/Movie';
import { ShowWatched, ShowWatchlist } from '../models/Show';

export const GlobalFilter = () => {
  const { filter } = useFilter();
  const [results, setResults] =
    useState<
      Array<MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist>
    >();
  const [searchValue, setSearchValue] = useState<string>();
  const { isWatched, isWatchlist } = useIsWatch();
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchValue) {
      const a = filter(searchValue);
      setResults(a.slice(0, 10));
    }
  }, [searchValue]);

  const getBgClass = (
    item: MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist,
    type: 'movie' | 'show'
  ) => {
    if (isWatched(item[type]?.ids.trakt, type)) {
      return 'bg-green-400';
    }
    if (isWatchlist(item[type]?.ids.trakt, type)) {
      return 'bg-blue-400';
    }
    return '';
  };

  return (
    <section
      className="fixed w-full z-30 top-0 flex flex-col h-full"
      style={{ marginTop: 'env(safe-area-inset-top)' }}
    >
      <div className="w-full bg-blue-100 flex items-center border-b-2">
        <input
          className="bg-blue-100 w-full px-2 py-2 outline-none grow text-gray-700 "
          placeholder="🔍 Escribe un título de tu colección"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={() => dispatch(setGlobalSearch(false))} tabIndex={-1}>
          <Emoji className="ml-3 mr-2" emoji="❌" />
        </button>
      </div>
      <ul className="flex flex-wrap items-stretch justify-center bg-blue-100 overflow-y-auto">
        {results &&
          results.map((item, i) => {
            const type = getType(item);
            return (
              <li
                key={`${item[type]?.ids?.trakt}_${i}`}
                className="p-2"
                style={{ flex: '1 0 50%', maxWidth: '10em' }}
                tabIndex={i + 1}
              >
                <div className={`rounded-lg ${getBgClass(item, type)}`}>
                  <ImageLink
                    text={item[type]?.title}
                    ids={item[type]?.ids}
                    item={item[type]}
                    style={{ minHeight: '13.5em' }}
                    type={type}
                    onClick={() => dispatch(setGlobalSearch(false))}
                  >
                    {item[type].title && (
                      <p className="text-sm text-center py-1">
                        {item[type].title}
                      </p>
                    )}
                  </ImageLink>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
