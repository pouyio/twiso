import { useEffect, useState } from 'react';
import { useQueryParam, NumberParam } from 'use-query-params';
import { PAGE_SIZE } from 'state/state';

export const usePagination = <T,>(items: T[]) => {
  const [currentPage = 1, setCurrentPage] = useQueryParam('page', NumberParam);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    setCurrentPage(currentPage);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const localLastPage = Math.ceil(items.length / PAGE_SIZE);
    setLastPage(localLastPage);
  }, [items.length]);

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

  const getItemsByPage = () => {
    return items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  };

  return {
    currentPage,
    lastPage,
    getItemsByPage,
    setFirst: () => setSafePage('first'),
    setLast: () => setSafePage('last'),
    setPrev: () => turnSafePage(-1),
    setNext: () => turnSafePage(1),
  };
};
