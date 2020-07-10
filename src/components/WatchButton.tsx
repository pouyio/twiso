import React, { useContext } from 'react';
import { Movie } from '../models';
import { AuthContext } from '../contexts';
import { useIsWatch } from '../hooks';
import { LoginButton } from '../components/LoginButton';
import {
  addWatched,
  removeWatched,
  addWatchlist,
  removeWatchlist,
} from 'state/slices/moviesSlice';
import { useDispatch } from 'react-redux';

interface IWatchButtonProps {
  item: Movie;
}

const WatchButton: React.FC<IWatchButtonProps> = ({ item }) => {
  const { isWatchlist, isWatched } = useIsWatch();

  const { session } = useContext(AuthContext);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-around my-8">
      {session ? (
        <>
          {isWatched(item.ids.trakt, 'movie') ? (
            <button
              className="bg-green-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={async () =>
                dispatch(removeWatched({ movie: item, session }))
              }
            >
              ✓ Vista
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatched({ movie: item, session }))}
            >
              Vista
            </button>
          )}
          {isWatchlist(item.ids.trakt, 'movie') ? (
            <button
              className="bg-blue-400 py-3 px-12 rounded-full text-white font-bold"
              onClick={() =>
                dispatch(removeWatchlist({ movie: item, session }))
              }
            >
              Pendiente
            </button>
          ) : (
            <button
              className="bg-gray-200 py-3 px-12 rounded-full text-gray-700 font-light"
              onClick={() => dispatch(addWatchlist({ movie: item, session }))}
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
