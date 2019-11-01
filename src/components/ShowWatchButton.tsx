import React, { useContext } from 'react';
import UserContext from '../utils/UserContext';
import { Show } from '../models';

interface IShowWatchButtonProps {
  item: Show;
}

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const { addShowWatchlist, removeShowWatchlist, isWatchlist } = useContext(
    UserContext,
  );

  return (
    <div className="flex justify-around my-8">
      {isWatchlist(item.ids.trakt, 'show') ? (
        <button
          className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
          onClick={() => removeShowWatchlist(item)}
        >
          Pendiente
        </button>
      ) : (
        <button
          className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
          onClick={() => addShowWatchlist(item)}
        >
          Pendiente
        </button>
      )}
    </div>
  );
};

export default ShowWatchButton;
