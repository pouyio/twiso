import React from 'react';
import Pagination from './Pagination';
import usePagination from '../../utils/usePagination';
import { PAGE_SIZE } from 'state/state';

interface IPaginationContainerProps {
  items: any[];
}

const PaginationContainer: React.FC<IPaginationContainerProps> = ({
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
  } = usePagination(items);

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

export default PaginationContainer;
