import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
export const PAGE_SIZE = 40;

export const usePagination = <T,>(items: T[]) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const currentPage = +(searchParams.get('page') || 1);
  const [lastPage, setLastPage] = useState(1);

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

    searchParams.set('page', `${currentPage + direction}`);
    setSearchParams(searchParams);
  };

  const setSafePage = (page: 'first' | 'last') => {
    const localPage = page === 'first' ? 1 : lastPage;
    searchParams.set('page', `${localPage}`);
    setSearchParams(searchParams);
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
