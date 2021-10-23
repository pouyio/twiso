import React from 'react';
import Pagination from './Pagination';
import { PAGE_SIZE } from '../../hooks/usePagination';
import { usePaginationOLD } from '../../hooks/usePaginationOLD';

interface IPaginationContainerProps {
  items: unknown[];
}

export const PaginationContainerOLD: React.FC<IPaginationContainerProps> = ({
  children,
  items,
}) => {
  const {
    currentPage,
    lastPage,
    setFirst,
    setLast,
    setPrev,
    setNext,
  } = usePaginationOLD(items);

  const LocalPagination = (
    <Pagination
      setFirst={setFirst}
      setPrev={setPrev}
      page={currentPage}
      last={lastPage}
      setNext={setNext}
      setLast={setLast}
    />
  );

  return (
    <>
      {items.length > PAGE_SIZE && LocalPagination}
      {children}
      {items.length > PAGE_SIZE && LocalPagination}
    </>
  );
};
