import { useEffect, useState, useCallback } from 'react';

const PAGE_SIZE = 40;

export default function usePagination(movies, location, history) {

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const turnPage = useCallback((finalPage) => {
        history.push({ search: `?page=${finalPage}` });
        setCurrentPage(finalPage);
    }, [history]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paramPage = +params.get('page');
        if (!paramPage) {
            turnPage(1);
        }
        setCurrentPage(+params.get('page') || 1);
    }, [location.search, turnPage]);

    useEffect(() => {
        const localLastPage = Math.ceil(movies.length / PAGE_SIZE);
        setLastPage(localLastPage);
    }, [movies.length]);



    const turnSafePage = (direction) => {
        const params = new URLSearchParams(location.search);
        let localPage = +params.get('page');
        if (localPage === 1 && direction === -1) {
            return;
        }

        if ((localPage >= lastPage) && direction === 1) {
            return;
        }

        localPage = localPage + direction;
        turnPage(localPage);
    }

    const setSafePage = (page) => {
        const localPage = page === 'first' ? 1 : lastPage;
        turnPage(localPage);
    }

    return {
        currentPage,
        lastPage,
        setFirst: () => setSafePage('first'),
        setLast: () => setSafePage('last'),
        setPrev: () => turnSafePage(-1),
        setNext: () => turnSafePage(1)
    };
}