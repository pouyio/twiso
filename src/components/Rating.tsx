import React from 'react';
import { Icon } from './Icon';

interface IRatingProps {
  rating: number;
  votes: number;
  expanded?: boolean;
  onClick?: () => void;
}

const Rating: React.FC<IRatingProps> = ({
  rating = 0,
  votes = 0,
  expanded,
  onClick,
}) => {
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
      {onClick && (
        <Icon
          name="arrow-right"
          className={`h-5 w-auto transition-transform ${
            expanded && 'rotate-90'
          }`}
        />
      )}
    </div>
  );
};

export default Rating;
