import React from 'react';
import { useAppSelector } from 'state/store';
import './ProgressBar.css';

export const ProgressBar: React.FC<React.PropsWithChildren<unknown>> = () => {
  const shows = useAppSelector((state) => state.shows.totalRequestsPending);
  const movies = useAppSelector((state) => state.movies.totalRequestsPending);

  return movies + shows > 0 ? (
    <div className="h-1 w-full animated-background bg-gradient-to-r from-gray-200 via-black to-gray-200"></div>
  ) : (
    <></>
  );
};
