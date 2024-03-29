import Genres from 'components/Genres';
import { useTranslate } from 'hooks';
import React, { useEffect, useState } from 'react';
import { genres } from 'utils/getGenre';
import { Icon } from 'components/Icon';

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
  const { t } = useTranslate();
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

  useEffect(() => {
    if (!showFilters) {
      selectedGenres.forEach(toggleGenre);
    }
  }, [showFilters]);

  return (
    <>
      <div className="flex justify-evenly text-2xl max-w-3xl m-auto">
        <button
          disabled={page === 1}
          className="mr-3 disabled:opacity-50"
          onClick={setFirst}
        >
          <Icon name="double-arrow-left" className="h-8" />
        </button>
        <button
          disabled={page === 1}
          className="mr-3 disabled:opacity-50"
          onClick={setPrev}
        >
          <Icon name="arrow-left" className="h-8" />
        </button>
        <h1 className="font-light flex items-center">
          {' '}
          {page} ... {last}{' '}
          {onFilter && (
            <Icon
              className="cursor-pointer pl-1 h-8"
              onClick={() => setShowFilters((s) => !s)}
              name="tags"
            />
          )}
        </h1>
        <button
          disabled={page === last}
          className="ml-3 disabled:opacity-50"
          onClick={setNext}
        >
          <Icon name="arrow-right" className="h-8" />
        </button>
        <button
          disabled={page === last}
          className="ml-3 disabled:opacity-50"
          onClick={setLast}
        >
          <Icon name="double-arrow-right" className="h-8" />
        </button>
      </div>
      {showFilters && (
        <div className="sticky top-0">
          <div className="inline-flex bg-blue-100 py-2 px-4 w-full flex-col border-b-2">
            <Genres onClick={toggleGenre} selected={selectedGenres} />
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;
