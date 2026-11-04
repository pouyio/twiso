import React, { useEffect, useRef, useState } from 'react';
import { getRelatedApi } from '../utils/api';
import ImageLink from './ImageLink';
import { Empty } from './Empty';
import { Show } from '../models/Show';
import { Movie } from '../models/Movie';
import { Ids } from '../models/Ids';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

interface IRelatedProps {
  itemIds: Ids;
  type: 'movie' | 'show';
}

export const placeholders = [
  <li
    key="placeholder-1"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-2"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-3"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-4"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-5"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-6"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-7"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-8"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-9"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
  <li
    key="placeholder-10"
    className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
  ></li>,
];

const Related: React.FC<IRelatedProps> = ({ itemIds, type }) => {
  const [results, setResults] = useState<(Show | Movie)[]>();
  const resultsRef = useRef<HTMLUListElement>(null);
  useScrollRestoration(resultsRef, 'horizontal');

  useEffect(() => {
    setResults(undefined);
    getRelatedApi<Show | Movie>(type, itemIds.tmdb).then((data) => {
      setResults(data);
    });
  }, [itemIds, type]);

  return (
    <ul
      ref={resultsRef}
      className="flex overflow-x-auto -mx-4 my-2 lg:mx-0 justify-between lg:overflow-auto lg:flex-wrap gap-4"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {results ? (
        results.length ? (
          results.map((r) => (
            <li key={r.ids.tmdb} className="w-35 shrink-0">
              <ImageLink text={r.title} ids={r.ids} type={type} />
            </li>
          ))
        ) : (
          <Empty />
        )
      ) : (
        placeholders
      )}
    </ul>
  );
};

export default Related;
