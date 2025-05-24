import { useLiveQuery } from 'dexie-react-hooks';
import { StatusMovie, StatusShow } from 'models/Api';
import db, { USER_MOVIES_TABLE, USER_SHOWS_TABLE } from 'utils/db';

export const useIsWatch = () => {
  const watchedMoviIds =
    useLiveQuery(
      () =>
        db
          .table<StatusMovie, string>(USER_MOVIES_TABLE)
          .where({ status: 'watched' })
          .primaryKeys(),
      [],
      []
    ) ?? [];

  const watchlistMovieIds =
    useLiveQuery(() =>
      db
        .table<StatusMovie, string>(USER_MOVIES_TABLE)
        .where({ status: 'watchlist' })
        .primaryKeys()
    ) ?? [];

  const watchedShows =
    useLiveQuery(
      () =>
        db
          .table<StatusShow, string>(USER_SHOWS_TABLE)
          .where({ status: 'watched' })
          .primaryKeys(),
      [],
      []
    ) ?? [];
  const watchedShowIds = watchedShows.map((s) => s.show_imdb);

  const watchlistShowIds =
    useLiveQuery(() =>
      db
        .table<StatusMovie, string>(USER_SHOWS_TABLE)
        .where({ status: 'watchlist' })
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

  return {
    isWatched,
    isWatchlist,
  };
};
