import Fuse from 'fuse.js';
import { useAppSelector } from 'state/store';

export const useFilter = () => {
  const movies = useAppSelector((state) => state.movies);
  const shows = useAppSelector((state) => state.shows);

  const filter = (text: string, genres: string[] = []) => {
    if (!text) {
      return [];
    }
    const fuse = new Fuse(
      [...Object.values(movies.movies), ...Object.values(shows.shows)],
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

    return fuse
      .search(text)
      .map((r) => r.item)
      .filter((i) => {
        return genres.length
          ? genres.every((g) => (i['movie'] || i['show']).genres.includes(g))
          : true;
      });
  };

  const filterBy = (text: string, type: 'movie' | 'show') => {
    if (!text) {
      return [];
    }

    const originalItems: any[] =
      type === 'movie'
        ? [...Object.values(movies.movies)]
        : type === 'show'
        ? [...Object.values(shows.shows)]
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
