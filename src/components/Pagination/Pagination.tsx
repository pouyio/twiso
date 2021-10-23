import React from 'react';
import Emoji from '../Emoji';

interface IPaginationProps {
  setFirst: () => void;
  setPrev: () => void;
  setNext: () => void;
  setLast: () => void;
  page: number;
  last: number;
}

const Pagination: React.FC<IPaginationProps> = ({
  setFirst,
  setPrev,
  setNext,
  setLast,
  page,
  last,
}) => {
  return (
    <div className="flex justify-center text-2xl">
      <button
        className={`mr-10 ${page === 1 ? 'opacity-50' : ''}`}
        onClick={setFirst}
      >
        <Emoji emoji="⏮" />
      </button>
      <button
        className={`mr-10 ${page === 1 ? 'opacity-50' : ''}`}
        onClick={setPrev}
      >
        <Emoji emoji="⬅️" />
      </button>
      <h1 className="font-light">
        {' '}
        {page} ... {last}{' '}
      </h1>
      <button
        className={`ml-10 ${page === last ? 'opacity-50' : ''}`}
        onClick={setNext}
      >
        <Emoji emoji="➡️" />
      </button>
      <button
        className={`ml-10 ${page === last ? 'opacity-50' : ''}`}
        onClick={setLast}
      >
        <Emoji emoji="⏭" />
      </button>
    </div>
  );
};

export default Pagination;
