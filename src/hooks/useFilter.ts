import { useLiveQuery } from 'dexie-react-hooks';
import Fuse from 'fuse.js';
import { useAppSelector } from '../state/store';
import { ItemType } from '../models/ItemType';
import { SearchMovie, SearchShow } from '../models/Movie';
import db, {
  DBMovieDetail,
  DBShowDetail,
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from '../utils/db';

export const useFilter = () => {
  const language = useAppSelector((state) => state.config.language);
  const userMovies = useLiveQuery(
    () => db[USER_MOVIES_TABLE].toCollection().primaryKeys(),
    [],
    []
  );
  const movies = useLiveQuery(
    () => db[DETAIL_MOVIES_TABLE].where('ids.imdb').anyOf(userMovies).toArray(),
    [userMovies],
    []
  );
  const userShows = useLiveQuery(
    () => db[USER_SHOWS_TABLE].toCollection().primaryKeys(),
    [],
    []
  );
  const shows = useLiveQuery(
    () => db[DETAIL_SHOWS_TABLE].where('ids.imdb').anyOf(userShows).toArray(),
    [userShows],
    []
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

  const filterBy = <T extends SearchMovie | SearchShow>(
    text: string,
    type: 'movie' | 'show'
  ): T[] => {
    if (!text) {
      return [];
    }

    const originalItems = type === 'movie' ? movies : shows;
    const fuse = new Fuse(originalItems as (DBMovieDetail | DBShowDetail)[], {
      threshold: 0.38,
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'overview', weight: 0.3 },
      ],
    });

    const results = fuse.search(text);

    if (type === 'movie') {
      return results.map((r) => ({
        movie: r.item as DBMovieDetail,
        score: r.score ?? 0,
        type: 'movie',
      })) as T[];
    }
    return results.map((r) => ({
      show: r.item as DBShowDetail,
      score: r.score ?? 0,
      type: 'show' as ItemType,
    })) as T[];
  };

  return { filter, filterBy };
};
