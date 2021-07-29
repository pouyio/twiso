import React from 'react';
import { Show } from '../models';
import { LoginButton } from './LoginButton';
import { removeWatchlist, addWatchlist } from 'state/thunks/shows';
import { useIsWatch } from 'hooks';
import { AuthService } from 'utils/AuthService';
import { useAppDispatch } from 'state/store';

interface IShowWatchButtonProps {
  item: Show;
}

const authService = AuthService.getInstance();

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { isWatchlist } = useIsWatch();

  return (
    <div className="flex justify-around my-8">
      {authService.isLoggedIn() ? (
        <>
          {isWatchlist(item.ids.trakt, 'show') ? (
            <button
              className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={() => dispatch(removeWatchlist({ show: item }))}
            >
              Pendiente
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatchlist({ show: item }))}
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
