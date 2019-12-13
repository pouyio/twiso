import React, { useContext } from 'react';
import { Show } from '../models';
import { useGlobalState } from '../state/store';
import AuthContext from '../utils/AuthContext';
import RegisterButton from './LoginButton';

interface IShowWatchButtonProps {
  item: Show;
}

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const { session } = useContext(AuthContext);

  const {
    state: {
      userInfo: {
        shows: { watchlist },
      },
    },
    actions: { addShowWatchlist, removeShowWatchlist },
  } = useGlobalState();

  const isWatchlist = () => {
    return watchlist.some(i => i.show.ids.trakt === item.ids.trakt);
  };

  return (
    <div className="flex justify-around my-8">
      {session ? (
        <>
          {isWatchlist() ? (
            <button
              className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={() => removeShowWatchlist(item, session!)}
            >
              Pendiente
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => addShowWatchlist(item, session!)}
            >
              Pendiente
            </button>
          )}
        </>
      ) : (
        <RegisterButton />
      )}
    </div>
  );
};

export default ShowWatchButton;
