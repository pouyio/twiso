import Fuse from 'fuse.js';
import { useAppSelector } from 'state/store';

export const useFilter = () => {
  const movies = useAppSelector((state) => state.movies);
  const shows = useAppSelector((state) => state.shows);

  const filter = (text: string) => {
    if (!text) {
      return [];
    }
    const fuse = new Fuse(
      [
        ...movies.watched,
        ...movies.watchlist,
        ...shows.watched,
        ...shows.watchlist,
      ],
      {
        threshold: 0.4,
        keys: [
          { name: 'movie.title', weight: 0.7 },
          { name: 'movie.overview', weight: 0.3 },
          { name: 'show.title', weight: 0.7 },
          { name: 'show.overview', weight: 0.3 },
        ],
      }
    );

    return fuse.search(text).map((r) => r.item);
  };

  const filterBy = (text: string, type: 'movie' | 'show') => {
    if (!text) {
      return [];
    }

    const originalItems: any[] =
      type === 'movie'
        ? [...movies.watched, ...movies.watchlist]
        : type === 'show'
        ? [...shows.watched, ...shows.watchlist]
        : [];

    const keys =
      type === 'movie'
        ? [
            { name: 'movie.title', weight: 0.7 },
            { name: 'movie.overview', weight: 0.3 },
          ]
        : type === 'show'
        ? [
            { name: 'show.title', weight: 0.7 },
            { name: 'show.overview', weight: 0.3 },
          ]
        : [];

    const fuse = new Fuse(originalItems, {
      threshold: 0.38,
      keys,
    });

    return fuse.search(text).map((r) => r.item);
  };

  return { filter, filterBy };
};
