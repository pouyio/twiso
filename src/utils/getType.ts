import { MovieWatched, MovieWatchlist } from '../models/Movie';
import { ShowWatched, ShowWatchlist } from '../models/Show';

export const getType = (
  element: MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist
): 'movie' | 'show' => {
  const keys = Object.keys(element);
  return keys.includes('movie') ? 'movie' : 'show';
};
