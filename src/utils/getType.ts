import { Movie } from '../models/Movie';
import { Show } from '../models/Show';

export const getType = (element: Movie | Show): 'movie' | 'show' => {
  const keys = Object.keys(element);
  return keys.includes('airs') ? 'show' : 'movie';
};
