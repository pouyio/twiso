import React, { useMemo, useState } from 'react';
import Emoji from './Emoji';

interface IRatingProps {
  rating: number;
  votes: number;
}

const Rating: React.FC<IRatingProps> = ({ rating = 0, votes = 0 }) => {
  const [showVotes, setShowVotes] = useState(true);
  const totalVotes = useMemo(() => {
    if (votes < 999) {
      return votes;
    }

    return Math.ceil(votes / 1000) + 'K';
  }, [votes]);

  return (
    <div onClick={() => setShowVotes((s) => !s)} className="cursor-pointer">
      {showVotes ? (
        <>
          <Emoji emoji="👍🏼" />
          {Math.floor((rating ?? 0) * 10)}%
        </>
      ) : (
        <>
          <Emoji emoji="🗳" />
          {totalVotes} votos
        </>
      )}
    </div>
  );
};

export default Rating;
