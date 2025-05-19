import { useLiveQuery } from 'dexie-react-hooks';
import { StatusMovie, StatusShow } from 'models/Api';
import { useAppSelector } from 'state/store';
import db, { USER_MOVIES_TABLE, USER_SHOWS_TABLE } from 'utils/db';

export const useIsWatch = () => {
  const watchedMoviIds =
    useLiveQuery(
      () =>
        db
          .table<StatusMovie, string>(USER_MOVIES_TABLE)
          .where({ status: 'completed' })
          .primaryKeys(),
      [],
      []
    ) ?? [];

  const watchlistMovieIds =
    useLiveQuery(() =>
      db
        .table<StatusMovie, string>(USER_MOVIES_TABLE)
        .where({ status: 'plantowatch' })
        .primaryKeys()
    ) ?? [];

  const watchedShowIds =
    useLiveQuery(
      () =>
        db
          .table<StatusShow, string>(USER_SHOWS_TABLE)
          .where('status')
          .anyOf(['completed', 'dropped', 'watching'])
          .primaryKeys(),
      [],
      []
    ) ?? [];

  const hiddenShowIds =
    useLiveQuery(
      () =>
        db
          .table<StatusShow, string>(USER_SHOWS_TABLE)
          .where('status')
          .equals('dropped')
          .primaryKeys(),
      [],
      []
    ) ?? [];

  const watchlistShowIds =
    useLiveQuery(() =>
      db
        .table<StatusMovie, string>(USER_SHOWS_TABLE)
        .where({ status: 'plantowatch' })
        .primaryKeys()
    ) ?? [];

  const isWatched = (id: string, type: 'show' | 'movie' = 'show') => {
    if (type === 'show') {
      return watchedShowIds.some((show) => show === id);
    }
    if (type === 'movie') {
      return watchedMoviIds.some((movie) => movie === id);
    }
  };

  const isWatchlist = (id: string, type: 'show' | 'movie' = 'show') => {
    if (type === 'show') {
      return watchlistShowIds.some((show) => show === id);
    }
    if (type === 'movie') {
      return watchlistMovieIds.some((movie) => movie === id);
    }
  };

  const isHidden = (id: string) => {
    return hiddenShowIds.some((show) => show === id);
  };

  return {
    isWatched,
    isWatchlist,
    isHidden,
  };
};
