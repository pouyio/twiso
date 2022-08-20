import React from 'react';
import Pagination from './Pagination';
import { usePagination } from '../../hooks';
import { PAGE_SIZE } from '../../hooks/usePagination';

interface IPaginationContainerProps {
  items: any[];
  onFilter?: (genres: string[]) => void;
}

const TopPagination: React.FC<IPaginationContainerProps> = ({
  items,
  onFilter,
}) => {
  const { currentPage, lastPage, setFirst, setLast, setPrev, setNext } =
    usePagination(items);
  return (
    <Pagination
      setFirst={setFirst}
      setPrev={setPrev}
      page={currentPage}
      last={lastPage}
      setNext={setNext}
      setLast={setLast}
      onFilter={onFilter}
    />
  );
};

const BottomPagination: React.FC<IPaginationContainerProps> = ({ items }) => {
  const { currentPage, lastPage, setFirst, setLast, setPrev, setNext } =
    usePagination(items);
  return (
    <Pagination
      setFirst={setFirst}
      setPrev={setPrev}
      page={currentPage}
      last={lastPage}
      setNext={setNext}
      setLast={setLast}
    />
  );
};

const PaginationContainer: React.FC<
  React.PropsWithChildren<IPaginationContainerProps>
> = ({ children, items, onFilter }) => {
  return (
    <>
      <TopPagination items={items} onFilter={onFilter} />
      {children}
      {items.length > PAGE_SIZE && <BottomPagination items={items} />}
    </>
  );
};

export default PaginationContainer;
