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
import { updateFullShow } from 'state/slices/shows/thunks';
import equal from 'fast-deep-equal';
// import diff from 'json-diff';

// const _mustUpdateMovie = (old: any, newer?: any) => {
//   if(old.movie.updated_at !== newer.movie.updated_at){
//     return true;
//   }
//   const oldMovie = JSON.parse(JSON.stringify(old));
//   const newerMovie = JSON.parse(JSON.stringify(newer));
//   const { votes: v1, localState, rank: r1, ...stripOld } = oldMovie as any;
//   const { votes: v2, rank: r2, ...stripNew } = newerMovie as any;
//   delete stripOld.movie.votes;
//   delete stripOld.movie.rating;
//   delete stripOld.movie.title;
//   delete stripOld.movie.overview;
//   delete stripOld.movie.comment_count;
//   delete stripOld.movie.updated_at;
//   delete stripNew.movie.votes;
//   delete stripNew.movie.rating;
//   delete stripNew.movie.title;
//   delete stripNew.movie.overview;
//   delete stripNew.movie.comment_count;
//   delete stripNew.movie.updated_at;

//   if (!equal(stripOld, stripNew)) {
//     console.log(old.movie.title);
//     console.log(diff.diffString(stripOld, stripNew));
//     return true;
//   }
//   return false;
// };

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
  if (oldShow.last_updated_at !== newerShow?.last_updated_at) {
    return true;
  }
  if (oldShow.last_watched_at !== newerShow?.last_watched_at) {
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

            // if (_mustUpdateMovie(m, newerMovie)) {
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

      if (!s.fullSeasons || s.show.updated_at !== newerShow?.show.updated_at) {
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
  loadMovies('watchlist');
  loadMovies('watched');
  loadWatchlistShows();
  loadWatchedShows();
};
