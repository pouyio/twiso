import { AuthContext } from '../contexts/AuthContext';
import React, { useContext } from 'react';
import {
  addWatchedMovie,
  addWatchlist,
  removeWatched,
  removeWatchlist,
} from '../state/slices/movies/thunks';
import { useAppDispatch, useAppSelector } from '../state/store';
import { LoginButton } from '../components/LoginButton';
import Emoji from './Emoji';
import { Movie } from '../models/Movie';
import { useIsWatch } from '../hooks/useIsWatch';
import { useTranslate } from '../hooks/useTranslate';

interface IWatchButtonProps {
  item: Movie;
}

const WatchButton: React.FC<IWatchButtonProps> = ({ item }) => {
  const { isWatchlist, isWatched } = useIsWatch();
  const { t } = useTranslate();

  const { session } = useContext(AuthContext);
  const isLoggedIn = !!session;
  const dispatch = useAppDispatch();
  const isWatchlistPending = useAppSelector((state) => {
    return state.movies.pending.watchlist.includes(item.ids.tmdb);
  });
  const isWatchedPending = useAppSelector((state) => {
    return state.movies.pending.watched.includes(item.ids.tmdb);
  });
  const watched = isWatched(item.ids.tmdb, 'movie');
  const watchlisted = isWatchlist(item.ids.tmdb, 'movie');

  return (
    <div className="flex justify-around">
      {isLoggedIn ? (
        <>
          <button
            className={`${
              watched
                ? 'bg-green-400 text-white font-bold'
                : 'bg-gray-200 text-gray-700 font-light'
            } transition-colors duration-300 py-3 pl-12 rounded-full ${
              isWatchedPending ? 'pr-6' : 'pr-12'
            }`}
            onClick={() => {
              if (watched) {
                dispatch(removeWatched({ movie: item }));
              } else {
                dispatch(addWatchedMovie({ movie: item }));
              }
            }}
          >
            {watched && '✓ '}
            {t('watched')}{' '}
            {isWatchedPending && (
              <Emoji emoji="⏳" rotating={true} className="inline-block" />
            )}
          </button>
          <button
            className={`${
              watchlisted
                ? 'bg-blue-400 text-white font-bold'
                : 'bg-gray-200 text-gray-700 font-light'
            } transition-colors duration-300 py-3 pl-12 rounded-full ${
              isWatchlistPending ? 'pr-6' : 'pr-12'
            }`}
            onClick={() => {
              if (watchlisted) {
                dispatch(removeWatchlist({ movie: item }));
              } else {
                dispatch(addWatchlist({ movie: item }));
              }
            }}
          >
            {t('watchlist')}{' '}
            {isWatchlistPending && (
              <Emoji emoji="⏳" rotating={true} className="inline-block" />
            )}
          </button>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};
export default WatchButton;
