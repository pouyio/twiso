import React, { useContext } from 'react';
import { Show } from '../models';
import { AuthContext } from '../contexts';
import { LoginButton } from './LoginButton';
import { useDispatch } from 'react-redux';
import { removeWatchlist, addWatchlist } from 'state/slices/showsSlice';
import { useIsWatch } from 'hooks';

interface IShowWatchButtonProps {
  item: Show;
}

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const { session } = useContext(AuthContext);

  const dispatch = useDispatch();
  const { isWatchlist } = useIsWatch();

  return (
    <div className="flex justify-around my-8">
      {session ? (
        <>
          {isWatchlist(item.ids.trakt, 'show') ? (
            <button
              className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={() => dispatch(removeWatchlist({ show: item, session }))}
            >
              Pendiente
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatchlist({ show: item, session }))}
            >
              Pendiente
            </button>
          )}
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default ShowWatchButton;
