import Genres from 'components/Genres';
import React, { useState } from 'react';
import { genres } from 'utils/getGenre';
import Emoji from '../Emoji';

interface IPaginationProps {
  setFirst: () => void;
  setPrev: () => void;
  setNext: () => void;
  setLast: () => void;
  onFilter?: (genres: string[]) => void;
  page: number;
  last: number;
}

const Pagination: React.FC<IPaginationProps> = ({
  setFirst,
  setPrev,
  setNext,
  setLast,
  onFilter,
  page,
  last,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const toggleGenre = (genre: string) => {
    setSelectedGenres((g) => {
      const newGenres = g.includes(genre)
        ? g.filter((g) => g !== genre)
        : [...selectedGenres, genre];
      if (onFilter) {
        onFilter(newGenres);
      }
      return newGenres;
    });
  };

  return (
    <>
      <div className="flex justify-evenly text-2xl max-w-3xl m-auto">
        <button
          disabled={page === 1}
          className="mr-3 disabled:opacity-50"
          onClick={setFirst}
        >
          <Emoji emoji="⏮" />
        </button>
        <button
          disabled={page === 1}
          className="mr-3 disabled:opacity-50"
          onClick={setPrev}
        >
          <Emoji emoji="⬅️" />
        </button>
        <h1 className="font-light">
          {' '}
          {page} ... {last}{' '}
          {onFilter && (
            <Emoji
              className="cursor-pointer"
              onClick={() => setShowFilters((s) => !s)}
              emoji="🪀"
            />
          )}
        </h1>
        <button
          disabled={page === last}
          className="ml-3  disabled:opacity-50"
          onClick={setNext}
        >
          <Emoji emoji="➡️" />
        </button>
        <button
          disabled={page === last}
          className="ml-3 disabled:opacity-50"
          onClick={setLast}
        >
          <Emoji emoji="⏭" />
        </button>
      </div>
      {showFilters && (
        <div className="inline-flex bg-blue-100 py-2 px-4 w-full sticky top-0 flex-col">
          <Genres
            genres={Object.keys(genres).filter(
              (g) => !selectedGenres.includes(g)
            )}
            onClick={toggleGenre}
            selected={selectedGenres}
          />
          {selectedGenres.length ? (
            <Genres
              genres={selectedGenres}
              onClick={toggleGenre}
              selected={selectedGenres}
            />
          ) : (
            'Selecciona alguno'
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
