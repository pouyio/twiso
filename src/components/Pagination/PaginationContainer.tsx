import React from 'react';
import Pagination from './Pagination';
import usePagination from '../../utils/usePagination';

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
      {LocalPagination}
      {children}
      {LocalPagination}
    </>
  );
};

export default PaginationContainer;
