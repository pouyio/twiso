import {
  getAllMovies,
  getAllShowsComplete,
  getAllShows,
  syncActivities,
} from '../utils/api';
import db, {
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from '../utils/db';
import { store } from './store';
import { fillDetail } from './slices/movies/thunks';
import { fillDetail as fillDetailShow } from './slices/shows/thunks';
import { Activities } from '../models/Api';

const syncRemoteMovies = async (
  oldActivities: Activities | null,
  newActivities: Activities | null
) => {
  if (oldActivities?.movies?.removed !== newActivities?.movies.removed) {
    const allMoviesIds = await getAllMovies().then(({ data }) =>
      data?.map((m) => m.movie_imdb)
    );
    const userMovies = await db.table(USER_MOVIES_TABLE).toArray();
    const moviesToDelete = userMovies.filter(
      (um) => !allMoviesIds?.includes(um.movie_imdb)
    );
    await db
      .table(USER_MOVIES_TABLE)
      .bulkDelete(moviesToDelete.map((m) => m.movie_imdb));
  }

  if (
    !oldActivities?.movies?.rest ||
    oldActivities.movies.rest !== newActivities?.movies.rest
  ) {
    const { data: allMovies } = await getAllMovies(oldActivities?.movies?.rest);
    if (allMovies) {
      await db.table(USER_MOVIES_TABLE).bulkPut(allMovies);
    }
  }
};

const syncRemoteShows = async (
  oldActivities: Activities | null,
  newActivities: Activities | null
) => {
  if (oldActivities?.shows?.removed !== newActivities?.shows.removed) {
    const allShowsIds = await getAllShows().then(({ data }) =>
      data?.map((s) => s.show_imdb)
    );
    const userShows = await db.table(USER_SHOWS_TABLE).toArray();

    const showsToDelete = userShows.filter(
      (us) => !allShowsIds?.includes(us.show_imdb)
    );
    await db
      .table(USER_SHOWS_TABLE)
      .bulkDelete(showsToDelete.map((s) => s.show_imdb));
  }

  if (oldActivities?.shows?.rest !== newActivities?.shows.rest) {
    const { data: allShows } = await getAllShowsComplete(
      oldActivities?.shows?.rest
    );
    if (allShows) {
      await db.table(USER_SHOWS_TABLE).bulkPut(allShows);
    }
  }
};

export const firstLoad = async (): Promise<boolean> => {
  try {
    const oldActivities: Activities | null = JSON.parse(
      localStorage.getItem('activities') ?? '{}'
    );
    const { data: newActivities } = await syncActivities();

    await syncRemoteMovies(oldActivities, newActivities);

    const localUserMovieWatchlistIds = await db
      .table<any, string>(USER_MOVIES_TABLE)
      .where({ status: 'watchlist' })
      .primaryKeys();
    const localUserMovieWatchedIds = await db
      .table<any, string>(USER_MOVIES_TABLE)
      .where({ status: 'watched' })
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
    return true;
  } catch (e) {
    console.error('Error on firstLoad');
    console.error(e);
    return false;
  }
};
