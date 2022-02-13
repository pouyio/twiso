import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';

export const getType = (
  element: MovieWatched | MovieWatchlist | ShowWatched | ShowWatchlist
): 'movie' | 'show' => {
  const keys = Object.keys(element);
  return keys.includes('movie') ? 'movie' : 'show';
};
