import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { RemoteFilterTypes } from '../pages/search/Search';

export interface ISearchParams {
  query: string;
  remote: boolean;
  types: RemoteFilterTypes;
}

export const useSearchParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [params, setParams] = useState<ISearchParams>(() => {
    const params = new URLSearchParams(location.search);
    return {
      query: params.get('query') || '',
      remote: params.get('remote') !== 'false',
      types:
        (params
          .get('types')
          ?.split(',')
          .filter(Boolean) as RemoteFilterTypes) || [],
    };
  });

  const updateURL = useCallback(
    (newParams: Partial<ISearchParams>) => {
      const merged = { ...params, ...newParams };
      const urlParams = new URLSearchParams();
      if (merged.query) urlParams.set('query', merged.query);
      urlParams.set('remote', String(merged.remote));
      if (merged.types.length > 0) {
        urlParams.set('types', merged.types.join(','));
      }
      navigate({ search: `?${urlParams.toString()}` }, { replace: true });
    },
    [navigate, params],
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setParams({
      query: urlParams.get('query') || '',
      remote: urlParams.get('remote') !== 'false',
      types:
        (urlParams
          .get('types')
          ?.split(',')
          .filter(Boolean) as RemoteFilterTypes) || [],
    });
  }, [location.search]);

  return {
    params,
    setQuery: (query: string) => updateURL({ query }),
    setFilters: (filters: Partial<Pick<ISearchParams, 'remote' | 'types'>>) =>
      updateURL(filters),
  };
};
