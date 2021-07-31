import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';
import { getWatchedApi, getWatchlistApi } from 'utils/api';
import db from 'utils/db';
import {
  addWatchlists as addWatchlistMovies,
  addWatcheds as addWatchedMovies,
  removeWatchlists as removeWatchlistMovies,
  removeWatcheds as removeWatchedtMovies,
  setWatched as setWatchedMovies,
  setWatchlist as setWatchlistMovies,
} from './slices/moviesSlice';
import {
  setTotalLoadingMovies,
  setTotalLoadingShows,
  updateTotalLoadingMovies,
  updateTotalLoadingShows,
} from './slices/rootSlice';
import {
  addWatchlists as addWatchlistShows,
  addWatched as addWatchedShow,
  removeWatcheds as removeWatchedShows,
  removeWatchlists as removeWatchlistShows,
  setWatched as setWatchedShows,
  setWatchlist as setWatchlistShows,
  updateShow,
} from './slices/showsSlice';
import { store } from './store';
import { getMovie } from './thunks/movies';
import { getShow, updateFullShow } from './thunks/shows';

const loadWatchlistMovies = async () => {
  const moviesWatchlist = await db
    .table<MovieWatchlist>('movies')
    .where({ localState: 'watchlist' })
    .toArray();

  store.dispatch(setWatchlistMovies(moviesWatchlist));

  const { data } = await getWatchlistApi<MovieWatchlist>('movie');

  const moviesToDelete = moviesWatchlist.filter(
    (d) => !data.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
  );
  store.dispatch(removeWatchlistMovies(moviesToDelete));

  const moviesToUpdate = moviesWatchlist
    .filter((m) => data.some((md) => md.movie.ids.trakt === m.movie.ids.trakt))
    .reduce<MovieWatchlist[]>((acc, m) => {
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

  const moviesToAdd = data.filter(
    (d) => !moviesWatchlist.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
  );
  store.dispatch(addWatchlistMovies(moviesToAdd));

  const outdatedMovies = [...moviesToAdd, ...moviesToUpdate];

  store.dispatch(setTotalLoadingMovies(outdatedMovies.length));

  outdatedMovies.forEach(async (outdated) => {
    try {
      store.dispatch(
        getMovie({ id: outdated.movie.ids.trakt, type: 'watchlist' })
      );
    } catch (error) {
      console.error(error);
    } finally {
      store.dispatch(updateTotalLoadingMovies());
    }
  });
};

const loadWatchedMovies = async () => {
  const moviesWatched = await db
    .table<MovieWatched>('movies')
    .where({ localState: 'watched' })
    .toArray();
  store.dispatch(setWatchedMovies(moviesWatched));
  const { data } = await getWatchedApi<MovieWatched>('movie');
  const moviesToDelete = moviesWatched.filter(
    (d) => !data.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
  );
  store.dispatch(removeWatchedtMovies(moviesToDelete));

  const moviesToUpdate = moviesWatched
    .filter((m) => data.some((md) => md.movie.ids.trakt === m.movie.ids.trakt))
    .reduce<MovieWatched[]>((acc, m) => {
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

  const moviesToAdd = data.filter(
    (d) => !moviesWatched.some((m) => m.movie.ids.trakt === d.movie.ids.trakt)
  );
  store.dispatch(addWatchedMovies(moviesToAdd));

  const outdatedMovies = [...moviesToAdd, ...moviesToUpdate];

  store.dispatch(setTotalLoadingMovies(outdatedMovies.length));

  outdatedMovies.forEach(async (outdated) => {
    try {
      store.dispatch(
        getMovie({ id: outdated.movie.ids.trakt, type: 'watched' })
      );
    } catch (error) {
      console.error(error);
    } finally {
      store.dispatch(updateTotalLoadingMovies());
    }
  });
};

const loadWatchlistShows = async () => {
  const showsWatchlist = await db
    .table<ShowWatchlist>('shows')
    .where({ localState: 'watchlist' })
    .toArray();
  store.dispatch(setWatchlistShows(showsWatchlist));
  const { data } = await getWatchlistApi<ShowWatchlist>('show');

  const showsToDelete = showsWatchlist.filter(
    (s) => !data.some((sd) => sd.show.ids.trakt === s.show.ids.trakt)
  );
  store.dispatch(removeWatchlistShows(showsToDelete));

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

  const showsToAdd = data.filter(
    (sd) => !showsWatchlist.some((s) => s.show.ids.trakt === sd.show.ids.trakt)
  );
  store.dispatch(addWatchlistShows(showsToAdd));

  const outdatedShows = [...showsToAdd, ...showsToUpdate];

  store.dispatch(setTotalLoadingShows(outdatedShows.length));

  outdatedShows.forEach(async (outdated) => {
    try {
      store.dispatch(
        getShow({ id: outdated.show.ids.trakt, type: 'watchlist' })
      );
    } catch (error) {
      console.error(error);
    } finally {
      store.dispatch(updateTotalLoadingMovies());
    }
  });
};

const loadWatchedShows = async () => {
  const showsWatched = await db
    .table<ShowWatched>('shows')
    .where({ localState: 'watched' })
    .toArray();
  store.dispatch(setWatchedShows(showsWatched));

  const { data } = await getWatchedApi<ShowWatched>('show');

  const showsToDelete = showsWatched.filter(
    (s) => !data.some((sd) => sd.show.ids.trakt === s.show.ids.trakt)
  );
  store.dispatch(removeWatchedShows(showsToDelete));

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
        acc.push({ ...newerShow! });
      }

      return acc;
    }, []);

  const showsToAdd = data.filter(
    (d) => !showsWatched.some((s) => s.show.ids.trakt === d.show.ids.trakt)
  );

  showsToUpdate.forEach((s) => store.dispatch(updateShow(s)));
  showsToAdd.forEach((s) => store.dispatch(addWatchedShow(s)));

  const outdatedShows = [...showsToAdd, ...showsToUpdate];

  store.dispatch(setTotalLoadingShows(outdatedShows.length));
  store.dispatch(updateTotalLoadingShows(showsToDelete.length));

  outdatedShows.forEach(async (outdated) => {
    try {
      store.dispatch(updateFullShow({ outdated }));
    } catch (error) {
      console.error(error);
    } finally {
      store.dispatch(updateTotalLoadingShows());
    }
  });
};

export const firstLoad = async () => {
  loadWatchedMovies();
  loadWatchlistMovies();

  loadWatchlistShows();
  loadWatchedShows();
};
