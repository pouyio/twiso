import { useTranslate } from 'hooks';
import React, { useEffect, useState } from 'react';
import { RemoteFilterTypes } from './Search';

export interface IFilters {
  types: RemoteFilterTypes;
}

interface ISearchFiltersProps {
  onFiltersChange: (filters: IFilters) => void;
}

export const SearchFilters: React.FC<ISearchFiltersProps> = ({
  onFiltersChange,
}) => {
  const [filterBy, setFilterBy] = useState<RemoteFilterTypes>([]);
  const { t } = useTranslate();

  const onFilterClick = (type: 'movie' | 'show' | 'person') => {
    setFilterBy((filters) => {
      const newFilters = filters.includes(type)
        ? filters.filter((f) => f !== type)
        : [...filters, type];
      return newFilters.length === 3 ? [] : newFilters;
    });
  };

  useEffect(() => {
    onFiltersChange({ types: filterBy });
  }, [onFiltersChange, filterBy]);

  return (
    <div className="my-2 lg:max-w-lg mx-auto flex flex-wrap items-center justify-center lg:justify-between">
      <div className="inline-flex my-1 lg:my-0">
        <button
          onClick={() => onFilterClick('movie')}
          className={`${
            filterBy.includes('movie')
              ? 'bg-gray-300'
              : 'bg-gray-100 opacity-75'
          } px-3 rounded-l`}
        >
          {t('movies')}
        </button>
        <button
          onClick={() => onFilterClick('show')}
          className={`${
            filterBy.includes('show') ? 'bg-gray-300' : 'bg-gray-100 opacity-75'
          } px-3 border-r border-l border-gray-100`}
        >
          {t('shows')}
        </button>
        <button
          onClick={() => onFilterClick('person')}
          className={`${
            filterBy.includes('person')
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
