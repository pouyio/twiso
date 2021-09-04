import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';
import { getWatchedApi, getWatchlistApi } from 'utils/api';
import db from 'utils/db';
import { set as setMovies, remove as removeMovies } from './slices/movies';
import {
  set as setShows,
  addWatched as addWatchedShow,
  remove as removeShows,
  updateShow,
} from './slices/shows';
import { store } from './store';
import { getMovie } from './slices/movies/thunks';
import { getShow, updateFullShow } from 'state/slices/shows/thunks';

const loadMovies = async (type: 'watched' | 'watchlist') => {
  const dbMovies = await db
    .table<MovieWatchlist | MovieWatched>('movies')
    .where({ localState: type })
    .toArray();

  store.dispatch(setMovies(dbMovies));

  const {
    data,
  }: { data: Array<MovieWatchlist | MovieWatched> } = await (type ===
  'watchlist'
    ? getWatchlistApi<MovieWatchlist>('movie')
    : getWatchedApi<MovieWatched>('movie'));

  const moviesToDelete = dbMovies.filter(
    (d) => !data.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
  );

  store.dispatch(removeMovies(moviesToDelete));

  const moviesToUpdate = dbMovies
    .filter((m) => data.some((md) => md.movie.ids.trakt === m.movie.ids.trakt))
    .reduce<Array<MovieWatchlist | MovieWatched>>((acc, m) => {
      const newerMovie = data.find(
        (md) => m.movie.ids.trakt === md.movie.ids.trakt
      );

      let shouldUpdate = false;

      if (m.movie.updated_at !== newerMovie?.movie.updated_at) {
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

  outdatedMovies.forEach(async (outdated) => {
    try {
      store.dispatch(getMovie({ id: outdated.movie.ids.trakt, type }));
    } catch (error) {
      console.error(error);
    } finally {
    }
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

      if (s.show.updated_at !== newerShow?.show.updated_at) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        acc.push({ ...newerShow! });
      }

      return acc;
    }, []);

  const showsToAdd = data
    .filter(
      (sd) =>
        !showsWatchlist.some((s) => s.show.ids.trakt === sd.show.ids.trakt)
    )
    .map((s) => ({ ...s, localState: 'watchlist' }));
  store.dispatch(setShows(showsToAdd as ShowWatchlist[]));

  const outdatedShows = [...showsToAdd, ...showsToUpdate];

  outdatedShows.forEach(async (outdated) => {
    try {
      store.dispatch(getShow({ id: outdated.show.ids.trakt }));
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

  const { data } = await getWatchedApi<ShowWatched>('show');

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

      if (!newerShow || !s.progress) {
        shouldUpdate = true;
      }

      if (
        s.show.updated_at !== newerShow?.show.updated_at ||
        s.last_watched_at !== newerShow?.last_watched_at
      ) {
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
  loadMovies('watchlist');
  loadMovies('watched');

  loadWatchlistShows();
  loadWatchedShows();
};
