import { useFilter, useIsWatch } from 'hooks';
import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';
import React, { useEffect, useRef, useState } from 'react';
import Emoji from './Emoji';
import ImageLink from './ImageLink';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/store-redux';

export const GlobalSearch = () => {
  const { filter } = useFilter();
  const [results, setResults] = useState<
    Array<MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist>
  >();
  const { isWatched, isWatchlist } = useIsWatch();
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const onFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const a = filter(event.target.value);
    setResults(a.slice(0, 10));
  };

  const getBgClass = (
    item: MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist
  ) => {
    if (isWatched(item[item.type || 'show'].ids.trakt, item.type || 'show')) {
      return 'bg-green-400';
    }
    if (isWatchlist(item[item.type || 'show'].ids.trakt, item.type || 'show')) {
      return 'bg-blue-400';
    }
    return '';
  };

  return (
    <section className="fixed w-full z-30 top-0">
      <div className="w-full bg-blue-100 flex items-center">
        <input
          ref={ref}
          autoFocus
          className="bg-blue-100 w-full text-black px-2 py-2 outline-none flex-grow text-gray-700 "
          placeholder="🔍 Escribe un título de tu colección"
          type="text"
          onChange={onFilter}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.keyCode === 27 || e.charCode === 27) {
              dispatch(setGlobalSearch(false));
            }
          }}
        />
        <button onClick={() => dispatch(setGlobalSearch(false))} tabIndex={-1}>
          <Emoji className="ml-3 mr-2" emoji="❌" />
        </button>
      </div>
      <ul className="flex flex-wrap items-stretch justify-center bg-white">
        {results &&
          results.map((item, i) => {
            return (
              <li
                key={`${item[item.type || 'show'].ids?.trakt}_${i}`}
                className="p-2"
                style={{ flex: '1 0 50%', maxWidth: '10em' }}
                onClick={() => dispatch(setGlobalSearch(false))}
                tabIndex={i + 1}
              >
                <div className={`rounded-lg ${getBgClass(item)}`}>
                  <ImageLink
                    text={item[item.type || 'show'].title}
                    ids={item[item.type || 'show'].ids}
                    item={item[item.type || 'show']}
                    style={{ minHeight: '13.5em' }}
                    type={item.type || 'show'}
                  >
                    {item[item.type || 'show'].title && (
                      <p className="text-sm text-center py-1">
                        {item[item.type || 'show'].title}
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
