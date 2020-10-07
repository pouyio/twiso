import {
  MovieWatched,
  MovieWatchlist,
  ShowWatched,
  ShowWatchlist,
} from 'models';
import {
  getWatchedApi,
  getWatchlistApi,
  getSeasonsApi,
  getProgressApi,
} from 'utils/api';
import db from 'utils/db';
import {
  setWatched as setWatchedMovies,
  setWatchlist as setWatchlistMovies,
} from './slices/moviesSlice';
import {
  addWatched as addWatchedShow,
  removeWatcheds as removeWatchedShows,
  setWatched as setWatchedShows,
  setWatchlist as setWatchlistShows,
  updateSeasons,
  updateProgress,
} from './slices/showsSlice';
import { store, setTotalLoadingShows, updateTotalLoadingShows } from './store';

const loadWatchlistMovies = async () => {
  const moviesWatchlist = await db
    .table<MovieWatchlist>('movies')
    .where({ localState: 'watchlist' })
    .toArray();
  store.dispatch(setWatchlistMovies(moviesWatchlist));
  const { data } = await getWatchlistApi<MovieWatchlist>('movie');
  store.dispatch(setWatchlistMovies(data));
};

const loadWatchedMovies = async () => {
  const moviesWatched = await db
    .table<MovieWatched>('movies')
    .where({ localState: 'watched' })
    .toArray();
  store.dispatch(setWatchedMovies(moviesWatched));
  const { data } = await getWatchedApi<MovieWatched>('movie');
  store.dispatch(setWatchedMovies(data));
  return true;
};

const loadWatchlistShows = async () => {
  const showsWatchlist = await db
    .table<ShowWatchlist>('shows')
    .where({ localState: 'watchlist' })
    .toArray();
  store.dispatch(setWatchlistShows(showsWatchlist));
  const { data } = await getWatchlistApi<ShowWatchlist>('show');
  store.dispatch(setWatchlistShows(data));
};

const loadWatchedShows = async () => {
  const showsWatched = await db
    .table<ShowWatched>('shows')
    .where({ localState: 'watched' })
    .toArray();
  store.dispatch(setWatchedShows(showsWatched));

  getWatchedApi<ShowWatched>('show').then(async ({ data }) => {
    const showsToUpdate = showsWatched.filter((s) => {
      return data.some(
        (sd) =>
          !s.progress ||
          (s.show.ids.trakt === sd.show.ids.trakt &&
            s.show.updated_at !== sd.show.updated_at)
      );
    });

    const showsToAdd = data.filter(
      (d) => !showsWatched.some((s) => s.show.ids.trakt === d.show.ids.trakt)
    );
    showsToAdd.forEach((s) => store.dispatch(addWatchedShow(s)));
    const outdatedShows = [...showsToAdd, ...showsToUpdate];

    store.dispatch(setTotalLoadingShows(outdatedShows.length));

    const showsToDelete = showsWatched.filter(
      (s) => !data.some((d) => d.show.ids.trakt === s.show.ids.trakt)
    );
    store.dispatch(removeWatchedShows(showsToDelete));
    store.dispatch(updateTotalLoadingShows(showsToDelete.length));

    outdatedShows.forEach(async (outdated) => {
      try {
        const [seasons, progress] = await Promise.all([
          getSeasonsApi(outdated.show.ids.trakt),
          getProgressApi(outdated.show.ids.trakt),
        ]);
        store.dispatch(
          updateSeasons({
            show: outdated,
            seasons: seasons.data,
          })
        );
        store.dispatch(
          updateProgress({
            show: outdated,
            progress: progress.data,
          })
        );
      } catch (error) {
        console.error(error);
      } finally {
        store.dispatch(updateTotalLoadingShows());
      }
    });
  });
};

export const firstLoad = async () => {
  loadWatchedMovies();
  loadWatchlistMovies();

  loadWatchlistShows();
  loadWatchedShows();
};
