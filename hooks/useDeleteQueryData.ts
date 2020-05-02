import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useDeleteQueryData = (type: 'movie' | 'show' | 'person') => {
  const { query, replace, pathname } = useRouter();

  useEffect(() => {
    const { data, id, ...rest } = query;

    if (query.data) {
      replace(
        {
          pathname,
          query: rest,
        },
        {
          pathname: `/${type}/${query.id}`,
          query: rest,
        },
      );
    }
  }, []);
};
