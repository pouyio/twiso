import React from 'react';
import { Movie } from '../models';
import { useIsWatch } from '../hooks';
import { LoginButton } from '../components/LoginButton';
import {
  addWatched,
  removeWatched,
  addWatchlist,
  removeWatchlist,
} from 'state/slices/moviesSlice';
import { useDispatch } from 'react-redux';
import { AuthService } from 'utils/AuthService';

interface IWatchButtonProps {
  item: Movie;
}

const WatchButton: React.FC<IWatchButtonProps> = ({ item }) => {
  const { isWatchlist, isWatched } = useIsWatch();

  const isLoggedIn = AuthService.getInstance().isLoggedIn();
  const dispatch = useDispatch();

  return (
    <div className="flex justify-around my-8">
      {isLoggedIn ? (
        <>
          {isWatched(item.ids.trakt, 'movie') ? (
            <button
              className="bg-green-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={async () => dispatch(removeWatched({ movie: item }))}
            >
              ✓ Vista
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatched({ movie: item }))}
            >
              Vista
            </button>
          )}
          {isWatchlist(item.ids.trakt, 'movie') ? (
            <button
              className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={() => dispatch(removeWatchlist({ movie: item }))}
            >
              Pendiente
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatchlist({ movie: item }))}
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
export default WatchButton;
