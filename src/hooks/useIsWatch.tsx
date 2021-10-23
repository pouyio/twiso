import { useAppSelector } from 'state/store';

export const useIsWatch = () => {
  const moviesWatchlist = useAppSelector((state) => state.movies.watchlist);
  const moviesWatched = useAppSelector((state) => state.movies.watched);
  const showsWatchlist = useAppSelector((state) => state.shows.watchlist);
  const showsWatched = useAppSelector((state) => state.shows.watched);

  const isWatched = (id: number, type: 'show' | 'movie' = 'show') => {
    if (type === 'show') {
      return !!showsWatched[id];
    }
    if (type === 'movie') {
      return !!moviesWatched[id];
    }
  };

  const isWatchlist = (id: number, type: 'show' | 'movie' = 'show') => {
    if (type === 'show') {
      return !!showsWatchlist[id];
    }
    if (type === 'movie') {
      return !!moviesWatchlist[id];
    }
  };

  return {
    isWatched,
    isWatchlist,
  };
};
