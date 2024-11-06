import React from 'react';
import Emoji from './Emoji';
import getGenre from '../utils/getGenre';
import { Empty } from './Empty';
import { useTranslate } from 'hooks';
import { genres as allGenres } from 'utils/getGenre';

interface IGenresProps {
  genres?: string[];
  selected?: string[];
  onClick?: (key: string) => void;
}

const Genres: React.FC<IGenresProps> = ({
  genres = Object.keys(allGenres),
  onClick,
  selected,
}) => {
  const { t } = useTranslate();
  return (
    <ul
      className={`flex overflow-x-auto my-2 -mx-4 text-sm lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start select-none ${
        onClick ? 'flex-wrap' : ''
      }`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {genres.length ? (
        genres.map((g) => (
          <li
            key={g}
            {...(onClick ? { onClick: () => onClick(g) } : {})}
            className={onClick ? 'cursor-pointer mb-1' : ''}
          >
            <div
              className={`bg-gray-100 px-2 py-1 rounded-full mx-1 whitespace-pre font-family-text ${
                selected?.some((s) => s === g)
                  ? 'bg-green-400 font-normal'
                  : 'font-light'
              }`}
            >
              <Emoji emoji={getGenre(g)} /> {t(g)}
            </div>
          </li>
        ))
      ) : (
        <Empty />
      )}
    </ul>
  );
};

export default Genres;
