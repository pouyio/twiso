import Genres from 'components/Genres';
import React, { useEffect } from 'react';
import { Icon } from 'components/Icon';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGenres =
    searchParams.get('genres')?.split(',').filter(Boolean) ?? [];
  const showFilters = searchParams.has('genres');

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((selectedGenres) => selectedGenres !== genre)
      : [...selectedGenres, genre];
    searchParams.set('genres', newGenres.join(','));
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (onFilter && selectedGenres) {
      onFilter(selectedGenres);
    }
  }, [selectedGenres]);

  const setToggleFilters = () => {
    if (showFilters) {
      searchParams.delete('genres');
      setSearchParams(searchParams);
    } else {
      searchParams.set('genres', '');
      setSearchParams(searchParams);
    }
  };

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
              onClick={() => setToggleFilters()}
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
