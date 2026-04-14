import { AuthContext } from '../../contexts/AuthContext';
import React, { useContext } from 'react';
import { useTranslate } from '../../hooks/useTranslate';
import { ISearchParams } from '../../hooks/useSearchParams';

interface ISearchFiltersProps {
  filters: Pick<ISearchParams, 'remote' | 'types'>;
  onFiltersChange: (
    filters: Partial<Pick<ISearchParams, 'remote' | 'types'>>,
  ) => void;
}

export const SearchFilters: React.FC<ISearchFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { session } = useContext(AuthContext);
  const { t } = useTranslate();

  const onFilterClick = (type: 'movie' | 'show' | 'person') => {
    const currentFilters = filters.types;
    const newFilters = currentFilters.includes(type)
      ? currentFilters.filter((f) => f !== type)
      : [...currentFilters, type];
    onFiltersChange({ types: newFilters.length === 3 ? [] : newFilters });
  };

  return (
    <div className="my-2 lg:max-w-lg mx-auto flex flex-wrap items-center justify-center lg:justify-between">
      {!!session && (
        <div className="flex whitespace-nowrap items-center my-1 lg:my-0 justify-center">
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => onFiltersChange({ remote: !filters.remote })}
          >
            <p className={`mr-3 ${filters.remote ? '' : 'opacity-75'}`}>
              {t('all')}
            </p>

            <div className="relative">
              <input
                type="checkbox"
                className="hidden"
                checked={filters.remote}
                onChange={() => null}
              />
              <div className="toggle__line w-8 h-3 bg-gray-400 rounded-full"></div>
              <div className="toggle__dot absolute w-5 h-5 bg-gray-200 rounded-full left-0"></div>
            </div>

            <p className={`ml-3 ${filters.remote ? 'opacity-75' : ''}`}>
              {t('my_collection')}
            </p>
          </div>
        </div>
      )}

      <div className="inline-flex my-1 lg:my-0">
        <button
          onClick={() => onFilterClick('movie')}
          className={`${
            filters.types.includes('movie')
              ? 'bg-gray-300'
              : 'bg-gray-100 opacity-75'
          } px-3 rounded-l`}
        >
          {t('movies')}
        </button>
        <button
          onClick={() => onFilterClick('show')}
          className={`${
            filters.types.includes('show')
              ? 'bg-gray-300'
              : 'bg-gray-100 opacity-75'
          } px-3 border-r border-l border-gray-100`}
        >
          {t('shows')}
        </button>
        <button
          onClick={() => onFilterClick('person')}
          className={`${
            filters.types.includes('person')
              ? 'bg-gray-300'
              : 'bg-gray-100 opacity-75'
          } px-3 rounded-r`}
        >
          {t('people')}
        </button>
      </div>
    </div>
  );
};
