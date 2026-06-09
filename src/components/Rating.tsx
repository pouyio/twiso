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
    return Math.ceil(votes / 1000) + 'k';
  }, [votes]);

  return (
    <div
      className={`flex items-center gap-2 ${onClick && 'cursor-pointer'}`}
      onClick={onClick}
      role="button"
    >
      <Icon name="like" className="h-5" />
      <span className="whitespace-nowrap">
        <span className="font-semibold">{(rating ?? 0).toFixed(1)} </span>
        <span className="text-sm">({totalVotes})</span>
      </span>
    </div>
  );
};

export default Rating;
