import React from 'react';
import { Show } from '../models';
import { LoginButton } from './LoginButton';
import { removeWatchlist, addWatchlist } from 'state/slices/shows/thunks';
import { useIsWatch } from 'hooks';
import { AuthService } from 'utils/AuthService';
import { useAppSelector } from 'state/store';
import Emoji from './Emoji';
import { useDispatch } from 'react-redux';

interface IShowWatchButtonProps {
  item: Show;
}

const authService = AuthService.getInstance();

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { isWatchlist } = useIsWatch();
  const isWatchlistPending = useAppSelector((state) => {
    return state.shows.pending.watchlist.includes(item.ids.trakt);
  });

  return (
    <div className="flex justify-around my-8">
      {authService.isLoggedIn() ? (
        <>
          {isWatchlist(item.ids.trakt, 'show') ? (
            <button
              className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={() => dispatch(removeWatchlist({ show: item }))}
            >
              Pendiente{' '}
              {isWatchlistPending && (
                <Emoji emoji="⏳" rotating={true} className="absolute ml-2" />
              )}
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatchlist({ show: item }))}
            >
              Pendiente{' '}
              {isWatchlistPending && (
                <Emoji emoji="⏳" rotating={true} className="absolute ml-2" />
              )}
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
