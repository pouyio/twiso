import { useAppSelector } from 'state/store';

export const useIsWatch = () => {
  const movies = useAppSelector((state) => state.movies);
  const shows = useAppSelector((state) => state.shows);

  const isWatched = (id: number, type: 'show' | 'movie') => {
    const items = `${type}s` === 'shows' ? shows : movies;
    return items.watched.some((i: any) => i[type].ids.trakt === id);
  };

  const isWatchlist = (id: number, type: 'show' | 'movie') => {
    const items = `${type}s` === 'shows' ? shows : movies;
    return items.watchlist.some((i: any) => i[type].ids.trakt === id);
  };

  return {
    isWatched,
    isWatchlist,
  };
};
