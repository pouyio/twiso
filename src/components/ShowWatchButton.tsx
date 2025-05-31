import { AuthContext } from 'contexts/AuthContext';
import React, { useContext } from 'react';
import { addWatchlist, removeWatchlist } from 'state/slices/shows/thunks';
import { useAppDispatch, useAppSelector } from 'state/store';
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
    return state.shows.pending.watchlist.includes(item.ids.imdb);
  });
  const { session } = useContext(AuthContext);
  const { t } = useTranslate();

  return (
    <div className="flex justify-around my-8">
      {!!session ? (
        <>
          {isWatchlist(item.ids.imdb ?? '', 'show') ? (
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
