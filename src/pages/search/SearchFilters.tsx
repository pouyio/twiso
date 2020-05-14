import React, { useState, useEffect } from 'react';
import { RemoteFilterTypes } from './Search';

export interface IFilters {
  remote: boolean;
  types: RemoteFilterTypes;
}

interface ISearchFiltersProps {
  onFiltersChange: (filters: IFilters) => void;
}

export const SearchFilters: React.FC<ISearchFiltersProps> = ({
  onFiltersChange,
}) => {
  const [filterBy, setFilterBy] = useState<RemoteFilterTypes>([]);
  const [remote, setRemote] = useState(true);

  const onFilterClick = (type: 'movie' | 'show' | 'person') => {
    setFilterBy(filters => {
      const newFilters = filters.includes(type)
        ? filters.filter(f => f !== type)
        : [...filters, type];
      return newFilters.length === 3 ? [] : newFilters;
    });
  };

  useEffect(() => {
    onFiltersChange({ remote, types: filterBy });
  }, [onFiltersChange, remote, filterBy]);

  return (
    <div className="my-2 lg:max-w-lg mx-auto flex flex-wrap items-center justify-center lg:justify-between">
      <div className="flex whitespace-no-wrap items-center my-1 lg:my-0 justify-center">
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => setRemote(a => !a)}
        >
          <p className={`mr-3 ${remote ? '' : 'opacity-75'}`}>Todo</p>

          <div className="relative">
            <input
              type="checkbox"
              className="hidden"
              checked={remote}
              onChange={() => null}
            />
            <div className="toggle__line w-8 h-3 bg-gray-400 rounded-full"></div>
            <div className="toggle__dot absolute w-5 h-5 bg-gray-200 rounded-full left-0"></div>
          </div>

          <p className={`ml-3 ${remote ? 'opacity-75' : ''}`}>Mi coleción</p>
        </div>
      </div>

      <div className="inline-flex my-1 lg:my-0">
        <button
          onClick={() => onFilterClick('movie')}
          className={`${
            filterBy.includes('movie')
              ? 'bg-gray-300'
              : 'bg-gray-100 opacity-75'
          } px-3 rounded-l`}
        >
          Películas
        </button>
        <button
          onClick={() => onFilterClick('show')}
          className={`${
            filterBy.includes('show') ? 'bg-gray-300' : 'bg-gray-100 opacity-75'
          } px-3 border-r border-l border-gray-100`}
        >
          Series
        </button>
        <button
          onClick={() => onFilterClick('person')}
          className={`${
            filterBy.includes('person')
              ? 'bg-gray-300'
              : 'bg-gray-100 opacity-75'
          } px-3 rounded-r`}
        >
          Personas
        </button>
      </div>
    </div>
  );
};
