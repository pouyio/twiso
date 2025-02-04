import { useCallback } from 'react';
import {
  URLSearchParamsInit,
  useSearchParams as useReactSearchParams,
} from 'react-router';
import { URLSearchParams } from 'url';

export const useSearchParams = (
  param?: URLSearchParamsInit
): [
  URLSearchParams,
  (
    nextInit: Record<string, string>,
    navigateOptions?:
      | {
          replace?: boolean | undefined;
          state?: any;
        }
      | undefined
  ) => void
] => {
  const [searchParams, setLocalSearchParams] = useReactSearchParams(param);

  const setValue = useCallback(
    (
      newValue: Record<string, string>,
      options?: {
        replace?: boolean | undefined;
        state?: any;
      }
    ) => {
      const oldParams = {};
      searchParams.forEach((value: string, key: string) => {
        oldParams[key] = value;
      });
      setLocalSearchParams(
        { ...oldParams, ...newValue },
        options ?? { replace: true }
      );
    },
    [searchParams, setLocalSearchParams]
  );

  return [searchParams, setValue];
};
