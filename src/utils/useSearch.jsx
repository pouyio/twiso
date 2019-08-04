import { useEffect, useState, useCallback } from 'react';
import useReactRouter from 'use-react-router';

export default function useSerch() {

    const { history, location } = useReactRouter();
    const [localSearch, setLocalSearch] = useState('');

    const setSearch = useCallback((query) => {
        history.push({ search: `?search=${query}` });
        setLocalSearch(query);
    }, [history]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paramSearch = params.get('search');
        if (!paramSearch) {
            return;
        }
        setSearch(paramSearch);
    }, [location.search, setSearch]);

    return {
        setSearch,
        search: localSearch
    };
}