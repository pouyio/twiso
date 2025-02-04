import React, { useMemo } from 'react';
import { Icon } from './Icon';

interface IRatingProps {
  rating: number;
  votes: number;
}

const Rating: React.FC<IRatingProps> = ({ rating = 0, votes = 0 }) => {
  const totalVotes = useMemo(() => {
    if (votes < 999) {
      return votes;
    }

    return Math.ceil(votes / 1000) + 'K';
  }, [votes]);

  return (
    <div className="flex">
      <Icon name="like" className="h-5" />
      {Math.floor((rating ?? 0) * 10)}% · {totalVotes}
    </div>
  );
};

export default Rating;
