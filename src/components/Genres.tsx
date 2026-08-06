import React from 'react';
import Emoji from './Emoji';
import { Empty } from './Empty';
import getGenre, { GENRE_IDS } from '../utils/getGenre';
import { useTranslate } from '../hooks/useTranslate';

interface IGenresProps {
  genres?: number[];
  selected?: number[];
  onClick?: (genreId: number) => void;
}

const Genres: React.FC<IGenresProps> = ({ genres, onClick, selected }) => {
  const { t } = useTranslate();
  const genreList = genres ?? GENRE_IDS;
  return (
    <ul
      className={`flex overflow-x-auto my-2 -mx-4 text-sm lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start select-none gap-y-1 ${
        onClick ? 'flex-wrap justify-evenly' : ''
      }`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {genreList.length ? (
        genreList.map((id) => (
          <li
            key={id}
            {...(onClick ? { onClick: () => onClick(id) } : {})}
            className={onClick ? 'cursor-pointer' : ''}
          >
            <div
              className={`bg-gray-100 px-2 py-1 rounded-full mx-1 whitespace-pre font-family-text ${
                selected?.some((s) => s === id)
                  ? 'bg-green-400 font-normal'
                  : 'font-light'
              }`}
            >
              <Emoji emoji={getGenre(id)} /> {t(`genre_${id}`)}
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
