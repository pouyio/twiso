import { useEffect, useState } from 'react';

import { PAGE_SIZE } from '../state/state';
import useQueryParams from './useQueryParams';

export const usePagination = <T,>(items: T[]) => {
  const [{ page: currentPage = '1' }, setParam] = useQueryParams();
  const [lastPage, setLastPage] = useState('1');

  useEffect(() => {
    const localLastPage = Math.ceil(items.length / PAGE_SIZE);
    setLastPage(`${localLastPage}`);
  }, [items.length]);

  const turnSafePage = (direction: 1 | -1) => {
    if (currentPage === '1' && direction === -1) {
      return;
    }

    if (currentPage >= lastPage && direction === 1) {
      return;
    }

    setParam({ page: `${+currentPage + direction}` });
    window.scrollTo(0, 0);
  };

  const setSafePage = (page: 'first' | 'last') => {
    const localPage = page === 'first' ? 1 : lastPage;
    setParam({ page: `${localPage}` });
  };

  const getItemsByPage = () => {
    return items.slice(
      (+currentPage - 1) * PAGE_SIZE,
      +currentPage * PAGE_SIZE,
    );
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
