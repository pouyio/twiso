import { useEffect, useState } from 'react';
import { useQueryParam, NumberParam } from 'use-query-params';
import { useGlobalState } from '../state/store';

const usePagination = (items: any[]) => {
  const [currentPage = 1, setCurrentPage] = useQueryParam('page', NumberParam);
  const [lastPage, setLastPage] = useState(1);
  const {
    state: { PAGE_SIZE },
  } = useGlobalState();

  useEffect(() => {
    setCurrentPage(currentPage);
    // eslint-disable-next-line
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
