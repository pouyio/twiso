import { useSelector } from 'react-redux';
import { IState } from 'state/state';

export const useIsWatch = () => {
  const movies = useSelector((state: IState) => state.movies);
  const shows = useSelector((state: IState) => state.shows);

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
