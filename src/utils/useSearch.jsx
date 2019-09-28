import { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useSerch() {
  const { history } = useHistory();
  const { location } = useLocation();
  const [localSearch, setLocalSearch] = useState('');

  const setSearch = useCallback(
    query => {
      history.push({ search: `?search=${query}` });
      setLocalSearch(query);
    },
    [history],
  );

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
    search: localSearch,
  };
}
