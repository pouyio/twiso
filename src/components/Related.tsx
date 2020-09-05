import React, { useEffect, useState } from 'react';
import { getRelatedApi } from '../utils/api';
import ImageLink from './ImageLink';
import { Show, Movie } from '../models';
import { Empty } from './Empty';

interface IRelatedProps {
  itemId: number;
  type: 'movie' | 'show';
}

const placeholderStyle = {
  minHeight: '13.5em',
  flex: '1 0 50%',
  maxWidth: '10em',
};

export const placeholders = [
  <li
    key="placeholder-1"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-2"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-3"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-4"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-5"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-6"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-7"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-8"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-9"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-10"
    className=" h-full bg-gray-300 rounded-lg m-2 animate-pulse"
    style={placeholderStyle}
  ></li>,
];

const Related: React.FC<IRelatedProps> = ({ itemId, type }) => {
  const [results, setResults] = useState<(Show | Movie)[]>();

  useEffect(() => {
    setResults(undefined);
    getRelatedApi<Show | Movie>(itemId, type).then(({ data }) => {
      setResults(data);
    });
  }, [itemId, type]);

  return (
    <ul
      className="flex overflow-x-auto -mx-4 my-2 lg:mx-0 justify-between lg:overflow-auto lg:flex-wrap"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {results ? (
        results.length ? (
          results.map((r) => (
            <li
              key={r.ids.trakt}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '10em' }}
            >
              <ImageLink
                item={r}
                text={r.title}
                ids={r.ids}
                type={type}
                style={{ minHeight: '13.5em' }}
              />
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
