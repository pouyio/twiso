import React, { useEffect, useState } from 'react';
import { getRelatedApi } from '../utils/api';
import ImageLink from './ImageLink';
import Emoji from './Emoji';
import { Show, Movie } from '../models';
import { TappableLi } from './Animated/TappableLi';

interface IRelatedProps {
  itemId: number;
  type: 'movie' | 'show';
}

const placeholderStyle = {
  minHeight: '13.5em',
  flex: '1 0 50%',
  maxWidth: '10em',
};
const placeholders = [
  <li
    key="placeholder-1"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-2"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-3"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-4"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-5"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-6"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-7"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-8"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-9"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
  <li
    key="placeholder-10"
    className=" h-full bg-gray-300 rounded-lg m-2"
    style={placeholderStyle}
  ></li>,
];

const Related: React.FC<IRelatedProps> = ({ itemId, type }) => {
  const [results, setResults] = useState<(Show | Movie)[]>();

  useEffect(() => {
    getRelatedApi<Show | Movie>(itemId, type).then(({ data }) => {
      setResults(data);
    });
  }, [itemId, type]);

  return (
    <ul
      className="flex overflow-y-hidden overflow-x-auto -mx-4 lg:mx-0 lg:overflow-hidden lg:flex-wrap lg:justify-center"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {results ? (
        results.length ? (
          results.map((r) => (
            <TappableLi
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
            </TappableLi>
          ))
        ) : (
          <li className="bg-gray-200 inline-block my-2 font-light px-3 py-2 rounded-full">
            Ninguno <Emoji emoji="😵" />
          </li>
        )
      ) : (
        placeholders
      )}
    </ul>
  );
};

export default Related;
