import React from 'react';
import { Movie } from '../models';
import { useIsWatch, useTranslate } from '../hooks';
import { LoginButton } from '../components/LoginButton';
import {
  addWatched,
  removeWatched,
  addWatchlist,
  removeWatchlist,
} from 'state/slices/movies/thunks';
import { useDispatch } from 'react-redux';
import { AuthService } from 'utils/AuthService';
import { useAppSelector } from 'state/store';
import Emoji from './Emoji';

interface IWatchButtonProps {
  item: Movie;
}

const WatchButton: React.FC<IWatchButtonProps> = ({ item }) => {
  const { isWatchlist, isWatched } = useIsWatch();
  const { t } = useTranslate();

  const isLoggedIn = AuthService.getInstance().isLoggedIn();
  const dispatch = useDispatch();
  const isWatchlistPending = useAppSelector((state) => {
    return state.movies.pending.watchlist.includes(item.ids.trakt);
  });
  const isWatchedPending = useAppSelector((state) => {
    return state.movies.pending.watched.includes(item.ids.trakt);
  });

  return (
    <div className="flex justify-around my-8">
      {isLoggedIn ? (
        <>
          {isWatched(item.ids.trakt, 'movie') ? (
            <button
              className={`bg-green-400 py-3 pl-12 rounded-full text-white font-bold ${
                isWatchedPending ? 'pr-6' : 'pr-12'
              }`}
              onClick={async () => dispatch(removeWatched({ movie: item }))}
            >
              ✓ {t('watched')}{' '}
              {isWatchedPending && (
                <Emoji emoji="⏳" rotating={true} className="inline-block" />
              )}
            </button>
          ) : (
            <button
              className={`bg-gray-200 py-3 pl-12 rounded-full text-gray-700 font-light ${
                isWatchedPending ? 'pr-6' : 'pr-12'
              }`}
              onClick={() => dispatch(addWatched({ movie: item }))}
            >
              {t('watched')}{' '}
              {isWatchedPending && (
                <Emoji emoji="⏳" rotating={true} className="inline-block" />
              )}
            </button>
          )}
          {isWatchlist(item.ids.trakt, 'movie') ? (
            <button
              className={`bg-blue-400 py-3 pl-12 rounded-full text-white font-bold ${
                isWatchlistPending ? 'pr-6' : 'pr-12'
              }`}
              onClick={() => dispatch(removeWatchlist({ movie: item }))}
            >
              {t('watchlist')}{' '}
              {isWatchlistPending && (
                <Emoji emoji="⏳" rotating={true} className="inline-block" />
              )}
            </button>
          ) : (
            <button
              className={`bg-gray-200 py-3 pl-12 rounded-full text-gray-700 font-light ${
                isWatchlistPending ? 'pr-6' : 'pr-12'
              }`}
              onClick={() => dispatch(addWatchlist({ movie: item }))}
            >
              {t('watchlist')}{' '}
              {isWatchlistPending && (
                <Emoji emoji="⏳" rotating={true} className="inline-block" />
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
export default WatchButton;
