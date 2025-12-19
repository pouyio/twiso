import React from 'react';
import { Empty } from './Empty';
import { Studio } from '../models/Api';

interface StudiosProps {
  studios: Studio[];
}

const Studios: React.FC<StudiosProps> = ({ studios }) => {
  return (
    <ul className="flex overflow-x-auto my-2 -mx-4 text-sm lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start select-none gap-y-1">
      {studios.length ? (
        studios.map((studio) => (
          <li key={studio.name + studio.country}>
            <div className="bg-gray-100 px-2 py-1 rounded-full mx-1 whitespace-pre font-family-text font-light">
              {studio.name} {studio.country ? `(${studio.country})` : ''}
            </div>
          </li>
        ))
      ) : (
        <Empty />
      )}
    </ul>
  );
};

export default Studios;
