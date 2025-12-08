import React from 'react';
import { useAppSelector } from '../../state/store';
import './ProgressBar.css';

export const ProgressBar: React.FC<React.PropsWithChildren<unknown>> = () => {
  const shows = useAppSelector((state) => state.shows.totalRequestsPending);
  const movies = useAppSelector((state) => state.movies.totalRequestsPending);
  const global = useAppSelector((state) => state.root.loading);

  return (
    <div
      className={`${
        movies + shows > 0 || global ? '' : 'hidden'
      } fixed h-1 w-full animated-background bg-linear-to-r from-gray-200 via-black to-gray-200`}
    ></div>
  );
};
