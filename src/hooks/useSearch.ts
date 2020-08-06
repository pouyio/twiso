import { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const useSearch = () => {
  const history = useHistory();
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState('');

  const setSearch = useCallback(
    (query: string) => {
      history.replace({ search: `?query=${query}` });
      setLocalSearch(query);
    },
    [history]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramSearch = params.get('query');
    if (!paramSearch) {
      return;
    }
    setSearch(paramSearch);
  }, [location.search, setSearch]);

  return {
    setSearch,
    search: localSearch,
  };
};
