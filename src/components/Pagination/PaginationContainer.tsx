import React from 'react';
import Pagination from './Pagination';
import { usePagination } from '../../hooks';
import { PAGE_SIZE } from '../../hooks/usePagination';

interface IPaginationContainerProps {
  total: number;
}

const PaginationContainer: React.FC<IPaginationContainerProps> = ({
  children,
  total,
}) => {
  const {
    lastPage,
    setFirst,
    setLast,
    setPrev,
    setNext,
    currentPage,
  } = usePagination(total);

  return (
    <>
      {total > PAGE_SIZE && (
        <Pagination
          setFirst={setFirst}
          setPrev={setPrev}
          page={currentPage}
          last={lastPage}
          setNext={setNext}
          setLast={setLast}
        />
      )}
      {children}
      {total > PAGE_SIZE && (
        <Pagination
          setFirst={setFirst}
          setPrev={setPrev}
          page={currentPage}
          last={lastPage}
          setNext={setNext}
          setLast={setLast}
        />
      )}
    </>
  );
};

export default PaginationContainer;
