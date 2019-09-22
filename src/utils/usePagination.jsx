import { useEffect, useState, useContext } from 'react';
import UserContext from './UserContext';
import { useQueryParam, NumberParam } from 'use-query-params';

export default function usePagination(items) {
  const [currentPage = 1, setCurrentPage] = useQueryParam('page', NumberParam);
  const [lastPage, setLastPage] = useState(1);
  const { PAGE_SIZE } = useContext(UserContext);

  useEffect(() => {
    setCurrentPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const localLastPage = Math.ceil(items.length / PAGE_SIZE);
    setLastPage(localLastPage);
  }, [items.length, PAGE_SIZE]);

  const turnSafePage = direction => {
    if (currentPage === 1 && direction === -1) {
      return;
    }

    if (currentPage >= lastPage && direction === 1) {
      return;
    }

    setCurrentPage(currentPage + direction);
    window.scrollTo(0, 0);
  };

  const setSafePage = page => {
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
}
