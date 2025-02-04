import { useAppSelector } from 'state/store';

export const useIsWatch = () => {
  const movies = useAppSelector((state) => state.movies);
  const shows = useAppSelector((state) => state.shows);

  const isWatched = (id: number, type: 'show' | 'movie' = 'show') => {
    if (type === 'show') {
      return shows.shows[id]?.localState === 'watched';
    }
    if (type === 'movie') {
      return movies.movies[id]?.localState === 'watched';
    }
  };

  const isWatchlist = (id: number, type: 'show' | 'movie' = 'show') => {
    if (type === 'show') {
      return shows.shows[id]?.localState === 'watchlist';
    }
    if (type === 'movie') {
      return movies.movies[id]?.localState === 'watchlist';
    }
  };

  const isHidden = (id: number) => {
    return shows.hidden[id];
  };

  return {
    isWatched,
    isWatchlist,
    isHidden,
  };
};
