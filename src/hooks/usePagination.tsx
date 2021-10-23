import { useEffect, useState } from 'react';
import { useQueryParam, NumberParam, withDefault } from 'use-query-params';
export const PAGE_SIZE = 20;

export const usePagination = (total: number) => {
  const [currentPage, setCurrentPage] = useQueryParam(
    'page',
    withDefault(NumberParam, 1)
  );
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const localLastPage = Math.ceil(total / PAGE_SIZE);
    setLastPage(localLastPage);
  }, [total]);

  const turnSafePage = (direction: 1 | -1) => {
    if (currentPage === 1 && direction === -1) {
      return;
    }

    if (currentPage >= lastPage && direction === 1) {
      return;
    }

    setCurrentPage(currentPage + direction);
    window.scrollTo(0, 0);
  };

  const setSafePage = (page: 'first' | 'last') => {
    const localPage = page === 'first' ? 1 : lastPage;
    setCurrentPage(localPage);
  };

  return {
    currentPage,
    lastPage,
    setFirst: () => setSafePage('first'),
    setLast: () => setSafePage('last'),
    setPrev: () => turnSafePage(-1),
    setNext: () => turnSafePage(1),
  };
};
