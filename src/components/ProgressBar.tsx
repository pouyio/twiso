import React from 'react';
import { useAppSelector } from 'state/store';
import Emoji from './Emoji';

export const ProgressBar: React.FC = () => {
  const shows = useAppSelector((state) => state.shows.totalRequestsPending);
  const movies = useAppSelector((state) => state.movies.totalRequestsPending);

  return movies + shows > 0 ? (
    <div className="absolute right-0 flex justify-end text-sm pr-1">
      <Emoji emoji="⏳" rotating={true} className="inline-block" />
    </div>
  ) : (
    <></>
  );
};
