import { useLiveQuery } from 'dexie-react-hooks';
import Fuse from 'fuse.js';
import { Movie } from 'models/Movie';
import { Show } from 'models/Show';
import { useAppSelector } from 'state/store';
import db, {
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from 'utils/db';

export const useFilter = () => {
  const language = useAppSelector((state) => state.config.language);
  const userMovies = useLiveQuery(
    () => db.table<any, string>(USER_MOVIES_TABLE).toCollection().primaryKeys(),
    [],
    [] as string[]
  );
  const movies = useLiveQuery(
    () =>
      db
        .table<Movie>(DETAIL_MOVIES_TABLE)
        .where('ids.imdb')
        .anyOf(userMovies)
        .toArray(),
    [userMovies],
    [] as Movie[]
  );
  const userShows = useLiveQuery(
    () => db.table<any, string>(USER_SHOWS_TABLE).toCollection().primaryKeys(),
    [],
    [] as string[]
  );
  const shows = useLiveQuery(
    () =>
      db
        .table<Show>(DETAIL_SHOWS_TABLE)
        .where('ids.imdb')
        .anyOf(userShows)
        .toArray(),
    [userShows],
    [] as Show[]
  );

  const filter = (text: string, genres: string[] = []) => {
    if (!text) {
      return [];
    }

    const keys = [
      { name: 'title', weight: 0.7 },
      { name: 'overview', weight: 0.3 },
    ];

    if (language === 'es') {
      keys.push(
        { name: 'translation.title', weight: 0.7 },
        { name: 'translation.overview', weight: 0.3 }
      );
    }

    const fuse = new Fuse([...movies, ...shows], {
      threshold: 0.4,
      keys,
    });

    return fuse
      .search(text)
      .map((r) => r.item)
      .filter((i) => {
        return genres.length ? genres.every((g) => i.genres.includes(g)) : true;
      });
  };

  const filterBy = (text: string, type: 'movie' | 'show') => {
    if (!text) {
      return [];
    }

    const originalItems: any[] =
      type === 'movie'
        ? [...Object.values(movies)]
        : type === 'show'
        ? [...Object.values(shows)]
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
