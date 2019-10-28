import { useEffect, useState, useContext } from 'react';
import UserContext from './UserContext';
import { useQueryParam, NumberParam } from 'use-query-params';

const usePagination = (items: any[]) => {
  const [currentPage = 1, setCurrentPage] = useQueryParam('page', NumberParam);
  const [lastPage, setLastPage] = useState(1);
  const { PAGE_SIZE } = useContext(UserContext);

  useEffect(() => {
    setCurrentPage(currentPage);
  }, []);

  useEffect(() => {
    const localLastPage = Math.ceil(items.length / PAGE_SIZE);
    setLastPage(localLastPage);
  }, [items.length, PAGE_SIZE]);

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

export default usePagination;
