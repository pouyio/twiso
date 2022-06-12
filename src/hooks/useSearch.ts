import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState('');

  const setSearch = useCallback(
    (query: string) => {
      navigate({ search: `?query=${query}` }, { replace: true });
      setLocalSearch(query);
    },
    [navigate]
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
