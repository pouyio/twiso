import { AuthContext } from '../contexts/AuthContext';
import React, { useContext } from 'react';
import { addWatchlist, removeWatchlist } from '../state/slices/shows/thunks';
import { useAppDispatch, useAppSelector } from '../state/store';
import Emoji from './Emoji';
import { LoginButton } from './LoginButton';
import { Show } from '../models/Show';
import { useIsWatch } from '../hooks/useIsWatch';
import { useTranslate } from '../hooks/useTranslate';

interface IShowWatchButtonProps {
  item: Show;
}

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { isWatchlist } = useIsWatch();
  const isWatchlistPending = useAppSelector((state) => {
    return state.shows.pending.watchlist.includes(item.ids.tmdb);
  });
  const watchlisted = isWatchlist(item.ids.tmdb, 'show');
  const { session } = useContext(AuthContext);
  const { t } = useTranslate();

  return (
    <div className="flex justify-around">
      {!!session ? (
        <>
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
                dispatch(removeWatchlist({ show: item }));
              } else {
                dispatch(addWatchlist({ show: item }));
              }
            }}
          >
            {watchlisted ? t('added_watchlist') : t('add_watchlist')}{' '}
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

export default ShowWatchButton;
