import React from 'react';
import { Show } from '../models';
import { LoginButton } from './LoginButton';
import { removeWatchlist, addWatchlist } from 'state/slices/shows/thunks';
import { useIsWatch, useTranslate } from 'hooks';
import { AuthService } from 'utils/AuthService';
import { useAppSelector, useAppDispatch } from 'state/store';
import Emoji from './Emoji';

interface IShowWatchButtonProps {
  item: Show;
}

const authService = AuthService.getInstance();

const ShowWatchButton: React.FC<IShowWatchButtonProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { isWatchlist } = useIsWatch();
  const isWatchlistPending = useAppSelector((state) => {
    return state.shows.pending.watchlist.includes(item.ids.trakt);
  });
  const { t } = useTranslate();

  return (
    <div className="flex justify-around my-8">
      {authService.isLoggedIn() ? (
        <>
          {isWatchlist(item.ids.trakt, 'show') ? (
            <button
              className={`bg-blue-400 py-3 pl-12 rounded-full text-white font-bold ${
                isWatchlistPending ? 'pr-6' : 'pr-12'
              }`}
              onClick={() => dispatch(removeWatchlist({ show: item }))}
            >
              {t('added_watchlist')}{' '}
              {isWatchlistPending && (
                <Emoji emoji="⏳" rotating={true} className="inline-block" />
              )}
            </button>
          ) : (
            <button
              className={`bg-gray-200 py-3 pl-12 rounded-full text-gray-700 font-light ${
                isWatchlistPending ? 'pr-6' : 'pr-12'
              }`}
              onClick={() => dispatch(addWatchlist({ show: item }))}
            >
              {t('add_watchlist')}{' '}
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

export default ShowWatchButton;
