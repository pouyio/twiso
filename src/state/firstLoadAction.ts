import {
  getAllItems,
  getHiddenShows,
  getWatchedApi,
  getWatchlistApi,
  syncActivities,
} from 'utils/api';
import db from 'utils/db';
import { set as setMovies, remove as removeMovies } from './slices/movies';
import {
  set as setShows,
  setHidden,
  addWatched as addWatchedShow,
  remove as removeShows,
  updateShow,
  updateHidden,
} from './slices/shows';
import { store } from './store';
import { getMovie } from './slices/movies/thunks';
import { updateFullShow } from 'state/slices/shows/thunks';
import equal from 'fast-deep-equal';
import { ShowWatched, ShowWatchlist } from '../models/Show';
import { MovieWatched, MovieWatchlist } from '../models/Movie';
import { differenceInHours } from 'date-fns';
import { Ids } from '../models/Ids';

const _mustUpdateByHours = (old: string, newer: string) => {
  // usually field updated_at from  getWatchedApi/getWatchedApi and getApi does not match exactly
  // so let them be up to 1 hour different
  const diff = differenceInHours(newer, old);
  return diff > 1;
};

const _mustUpdateShowWatched = (
  oldShow: ShowWatched,
  newerShow?: ShowWatched
) => {
  if (!newerShow) {
    return true;
  }
  if (!oldShow.progress) {
    return true;
  }
  if (_mustUpdateByHours(oldShow.last_updated_at, newerShow!.last_updated_at)) {
    return true;
  }
  if (oldShow.plays !== newerShow?.plays) {
    return true;
  }
  if (!equal(oldShow.seasons, newerShow?.seasons)) {
    return true;
  }
  if (oldShow.show.aired_episodes !== newerShow.show.aired_episodes) {
    return true;
  }
  return false;
};

const loadMovies = async (type: 'watched' | 'watchlist') => {
  const dbMovies = await db
    .table<MovieWatchlist | MovieWatched>('movies')
    .where({ localState: type })
    .toArray();

  store.dispatch(setMovies(dbMovies));

  const { data }: { data: Array<MovieWatchlist | MovieWatched> } =
    await (type === 'watchlist'
      ? getWatchlistApi<MovieWatchlist>('movie')
      : getWatchedApi<MovieWatched>('movie'));

  const moviesToDelete = dbMovies.filter(
    (d) => !data.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
  );

  store.dispatch(removeMovies(moviesToDelete));

  const moviesToUpdate: Array<MovieWatchlist | MovieWatched> =
    type === 'watched'
      ? []
      : dbMovies
          .filter((m) =>
            data.some((md) => md.movie.ids.trakt === m.movie.ids.trakt)
          )
          .reduce<Array<MovieWatchlist | MovieWatched>>((acc, m) => {
            const newerMovie = data.find(
              (md) => m.movie.ids.trakt === md.movie.ids.trakt
            );

            let shouldUpdate = false;

            if (
              _mustUpdateByHours(
                m.movie.updated_at,
                newerMovie!.movie.updated_at
              )
            ) {
              shouldUpdate = true;
            }

            if (shouldUpdate) {
              acc.push({ ...newerMovie! });
            }

            return acc;
          }, []);

  const moviesToAdd = data
    .filter(
      (d) => !dbMovies.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
    )
    .map((m) => ({ ...m, localState: type } as any));
  store.dispatch(setMovies(moviesToAdd));

  const outdatedMovies = [...moviesToAdd, ...moviesToUpdate];

  outdatedMovies.forEach((outdated) => {
    store.dispatch(getMovie({ id: outdated.movie.ids.trakt }));
  });
};

const loadWatchlistShows = async () => {
  const showsWatchlist = await db
    .table<ShowWatchlist>('shows')
    .where({ localState: 'watchlist' })
    .toArray();
  store.dispatch(setShows(showsWatchlist));
  const { data } = await getWatchlistApi<ShowWatchlist>('show');

  const showsToDelete = showsWatchlist.filter(
    (s) => !data.some((sd) => sd.show.ids.trakt === s.show.ids.trakt)
  );
  store.dispatch(removeShows(showsToDelete));

  const showsToUpdate = showsWatchlist
    .filter((s) => data.some((sd) => sd.show.ids.trakt === s.show.ids.trakt))
    .reduce<ShowWatchlist[]>((acc, s) => {
      const newerShow = data.find(
        (sd) => s.show.ids.trakt === sd.show.ids.trakt
      );

      let shouldUpdate = false;

      if (
        !s.fullSeasons ||
        _mustUpdateByHours(s.show.updated_at, newerShow!.show.updated_at)
      ) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        acc.push({ ...newerShow! });
      }

      return acc;
    }, []);

  const showsToAdd: ShowWatchlist[] = data
    .filter(
      (sd) =>
        !showsWatchlist.some((s) => s.show.ids.trakt === sd.show.ids.trakt)
    )
    .map((s) => ({ ...s, localState: 'watchlist' }));
  store.dispatch(setShows(showsToAdd));

  const outdatedShows = [...showsToAdd, ...showsToUpdate];

  outdatedShows.forEach(async (outdated) => {
    try {
      store.dispatch(updateFullShow({ outdated }));
    } catch (error) {
      console.error(error);
    } finally {
    }
  });
};

const loadWatchedShows = async () => {
  const showsWatched = await db
    .table<ShowWatched>('shows')
    .where({ localState: 'watched' })
    .toArray();
  store.dispatch(setShows(showsWatched));

  const showsHidden = await db.table<Ids>('shows-hidden').toArray();
  store.dispatch(setHidden(showsHidden));

  const { data } = await getWatchedApi<ShowWatched>('show');
  const { data: hidden } = await getHiddenShows();
  store.dispatch(updateHidden(hidden.map((s) => s.show.ids)));

  const showsToDelete = showsWatched.filter(
    (s) => !data.some((sd) => sd.show.ids.trakt === s.show.ids.trakt)
  );
  store.dispatch(removeShows(showsToDelete));

  const showsToUpdate = showsWatched
    .filter((s) => data.some((sd) => sd.show.ids.trakt === s.show.ids.trakt))
    .reduce<ShowWatched[]>((acc, s) => {
      const newerShow = data.find(
        (sd) => s.show.ids.trakt === sd.show.ids.trakt
      );

      let shouldUpdate = false;

      if (_mustUpdateShowWatched(s, newerShow)) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        acc.push({ ...newerShow!, localState: 'watched' });
      }

      return acc;
    }, []);

  const showsToAdd = data
    .filter(
      (d) => !showsWatched.some((s) => s.show.ids.trakt === d.show.ids.trakt)
    )
    .map((s) => ({
      ...s,
      localState: 'watched' as 'watched',
    }));

  showsToUpdate.forEach((s) => store.dispatch(updateShow(s)));
  showsToAdd.forEach((s) => store.dispatch(addWatchedShow(s)));

  const outdatedShows = [...showsToAdd, ...showsToUpdate];

  outdatedShows.forEach(async (outdated) => {
    try {
      store.dispatch(updateFullShow({ outdated }));
    } catch (error) {
      console.error(error);
    }
  });
};

export const firstLoad = async () => {
  try {
    const oldActivities = JSON.parse(
      localStorage.getItem('activities') ?? '{}'
    );
    const { data: newActivities } = await syncActivities();
    const { data: allItems } = await getAllItems();
    db.table('movies-s').bulkPut(allItems.movies);

    const savedMovies = await db.table('movies').toArray();
    const savedMoviesIds = savedMovies.map((m) => m.movie.ids.imdb);

    store.dispatch(setMovies(allItems.movies));

    allItems.movies
      // .filter((m) => m.status === 'plantowatch')
      // .filter((m) => m.status === 'completed')
      .filter((m) => !savedMoviesIds.includes(m.movie.ids.imdb))
      .forEach((item) => {
        store.dispatch(getMovie({ id: item.movie.ids.imdb }));
      });
    db.table('shows-s').bulkPut(allItems.shows);
    // db.table('animes-s').bulkPut(allItems.anime);
  } catch (e) {
    console.error('Error on firstLoad');
    console.error(e);
  }
};
