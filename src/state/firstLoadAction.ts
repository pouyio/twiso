import {
  getAllAnimeIds,
  getAllAnimes,
  getAllMovies,
  getAllMoviesIds,
  getAllShows,
  getAllShowsIds,
  getHiddenShows,
  getWatchedApi,
  getWatchlistApi,
  removeWatchedApi,
  removeWatchedShowsApis,
  syncActivities,
} from 'utils/api';
import db, {
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from 'utils/db';
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
import { fillDetail, getMovie } from './slices/movies/thunks';
import { fillDetail as fillDetailShow } from './slices/shows/thunks';
import { updateFullShow } from 'state/slices/shows/thunks';
import equal from 'fast-deep-equal';
import { ShowWatched, ShowWatchlist } from '../models/Show';
import { MovieWatched, MovieWatchlist } from '../models/Movie';
import { differenceInHours } from 'date-fns';
import { Ids } from '../models/Ids';
import { Activities, StatusMovie } from 'models/Api';

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

const syncRemoteMovies = async (
  oldActivities: Activities | null,
  newActivities: Activities
) => {
  if (
    oldActivities?.movies?.removed_from_list !==
    newActivities.movies.removed_from_list
  ) {
    const allMoviesIds = await getAllMoviesIds();
    const userMovies = await db.table(USER_MOVIES_TABLE).toArray();
    const moviesToDelete = userMovies.filter(
      (um) => !allMoviesIds.includes(um.movie.ids.imdb)
    );
    await db
      .table(USER_MOVIES_TABLE)
      .bulkDelete(moviesToDelete.map((m) => m.movie.ids.imdb));
  }

  if (
    oldActivities?.movies?.completed !== newActivities.movies.completed ||
    oldActivities?.movies?.plantowatch !== newActivities.movies.plantowatch
  ) {
    const { data: allMovies } = await getAllMovies(oldActivities?.movies?.all);

    const moviesToUpsert =
      allMovies?.movies.filter((m) =>
        ['completed', 'plantowatch'].includes(m.status)
      ) ?? [];

    await db.table(USER_MOVIES_TABLE).bulkPut(moviesToUpsert);
  }
};

const syncRemoteShows = async (
  oldActivities: Activities | null,
  newActivities: Activities
) => {
  if (
    oldActivities?.tv_shows?.removed_from_list !==
    newActivities.tv_shows.removed_from_list
  ) {
    const allShowsIds = await getAllShowsIds();

    const userShows = await db.table(USER_SHOWS_TABLE).toArray();

    const showsToDelete = userShows.filter(
      (us) => !allShowsIds.includes(us.show.ids.imdb)
    );
    await db
      .table(USER_SHOWS_TABLE)
      .bulkDelete(showsToDelete.map((s) => s.show.ids.imdb));
  }

  if (
    oldActivities?.tv_shows?.completed !== newActivities.tv_shows.completed ||
    oldActivities?.tv_shows?.watching !== newActivities.tv_shows.watching ||
    oldActivities?.tv_shows?.dropped !== newActivities.tv_shows.dropped ||
    oldActivities?.tv_shows?.plantowatch !== newActivities.tv_shows.plantowatch
  ) {
    const { data: allShows } = await getAllShows(oldActivities?.tv_shows?.all);

    const showsToUpsert =
      allShows?.shows.filter((m) =>
        ['completed', 'dropped', 'plantowatch', 'watching'].includes(m.status)
      ) ?? [];

    await db.table(USER_SHOWS_TABLE).bulkPut(showsToUpsert);
  }
};

const syncRemoteAnimes = async (
  oldActivities: Activities | null,
  newActivities: Activities
) => {
  if (
    oldActivities?.anime?.removed_from_list !==
    newActivities.anime.removed_from_list
  ) {
    const allAnimeIds = await getAllAnimeIds();

    const userAnimeShows = await db
      .table(USER_SHOWS_TABLE)
      .where('anime_type')
      .anyOf(['tv', 'special', 'ona', 'ova'])
      .toArray();
    const userAnimeMovies = await db
      .table(USER_MOVIES_TABLE)
      .where('anime_type')
      .equals('movie')
      .toArray();

    const userAnimes = [...userAnimeShows, ...userAnimeMovies];

    const animesToDelete = userAnimes.filter(
      (us) => !allAnimeIds.includes(us.show.ids.imdb)
    );

    await db
      .table(USER_SHOWS_TABLE)
      .bulkDelete(animesToDelete.map((s) => s.show.ids.imdb));
    await db
      .table(USER_MOVIES_TABLE)
      .bulkDelete(animesToDelete.map((s) => s.show.ids.imdb));
  }

  if (
    oldActivities?.anime?.completed !== newActivities.anime.completed ||
    oldActivities?.anime?.watching !== newActivities.anime.watching ||
    oldActivities?.anime?.dropped !== newActivities.anime.dropped ||
    oldActivities?.anime?.plantowatch !== newActivities.anime.plantowatch
  ) {
    const { data: allAnimes } = await getAllAnimes(oldActivities?.anime?.all);

    const animesToUpsert =
      allAnimes?.anime.filter((m) =>
        ['completed', 'dropped', 'plantowatch', 'watching'].includes(m.status)
      ) ?? [];
    const animeShowsToUpsert = animesToUpsert.filter((a) =>
      ['tv', 'special', 'ona', 'ova'].includes(a.anime_type)
    );
    const animeMoviesToUpsert = animesToUpsert.filter((a) =>
      ['movie'].includes(a.anime_type)
    );

    await db.table(USER_SHOWS_TABLE).bulkPut(animeShowsToUpsert);
    await db
      .table(USER_MOVIES_TABLE)
      .bulkPut(animeMoviesToUpsert.map((a) => ({ ...a, movie: a.show })));
  }
};

export const firstLoad = async () => {
  try {
    const oldActivities: Activities | null = JSON.parse(
      localStorage.getItem('activities') ?? '{}'
    );
    const { data: newActivities } = await syncActivities();

    await syncRemoteAnimes(oldActivities, newActivities);
    await syncRemoteMovies(oldActivities, newActivities);

    const localUserMovieWatchlistIds = await db
      .table<any, string>(USER_MOVIES_TABLE)
      .where({ status: 'plantowatch' })
      .primaryKeys();
    const localUserMovieWatchedIds = await db
      .table<any, string>(USER_MOVIES_TABLE)
      .where({ status: 'completed' })
      .primaryKeys();
    const localDetailMovieIds = await db
      .table<any, string>(DETAIL_MOVIES_TABLE)
      .toCollection()
      .primaryKeys();

    const movieIdsToFill = [
      ...localUserMovieWatchlistIds,
      ...localUserMovieWatchedIds,
    ].filter((id) => !localDetailMovieIds.includes(id));

    movieIdsToFill.forEach((id) => {
      store.dispatch(fillDetail({ id }));
    });

    await syncRemoteShows(oldActivities, newActivities);
    const localUserShowIds = await db
      .table<any, string>(USER_SHOWS_TABLE)
      .toCollection()
      .primaryKeys();
    const localDetailShowIds = await db
      .table<any, string>(DETAIL_SHOWS_TABLE)
      .toCollection()
      .primaryKeys();

    const showIdsToFill = localUserShowIds.filter(
      (id) => !localDetailShowIds.includes(id)
    );

    showIdsToFill.forEach((id) => {
      store.dispatch(fillDetailShow({ id }));
    });

    localStorage.setItem('activities', JSON.stringify(newActivities));
  } catch (e) {
    console.error('Error on firstLoad');
    console.error(e);
  }
};
