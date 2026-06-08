import React from 'react';
import { Icon } from './Icon';

interface IRatingProps {
  rating: number;
  votes: number;
  onClick?: () => void;
}

const Rating: React.FC<IRatingProps> = ({ rating = 0, votes = 0, onClick }) => {
  const totalVotes = React.useMemo(() => {
    if (votes < 999) return votes;
    return Math.ceil(votes / 1000) + 'K';
  }, [votes]);

  return (
    <div
      className={`flex items-center gap-2 ${onClick && 'cursor-pointer'}`}
      onClick={onClick}
      role="button"
    >
      <Icon name="like" className="h-5" />
      <span className="whitespace-nowrap">
        {Math.floor((rating ?? 0) * 10)}% &middot; {totalVotes}
      </span>
    </div>
  );
};

export default Rating;
