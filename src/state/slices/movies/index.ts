import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieWatchlist, MovieWatched, Movie } from 'models';
import {
  addWatched,
  addWatchlist as addWatchlistThunk,
  getMovie,
  populateDetail,
  removeWatched,
  removeWatchlist as removeWatchlistThunk,
} from 'state/slices/movies/thunks';
import { RootState } from 'state/store';

interface MoviesState {
  ready: boolean;
  pending: { watched: number[]; watchlist: number[] };
  detail?: Movie;
  movies: Record<number, MovieWatched | MovieWatchlist>;
}

const initialState: MoviesState = {
  ready: true,
  pending: {
    watched: [],
    watchlist: [],
  },
  movies: [],
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState: initialState,
  reducers: {
    set(
      state,
      { payload }: PayloadAction<Array<MovieWatched | MovieWatchlist>>
    ) {
      payload.forEach((movie) => {
        state.movies[movie.movie.ids.trakt] = movie;
      });
    },
    remove(
      state,
      { payload }: PayloadAction<Array<MovieWatched | MovieWatchlist>>
    ) {
      payload.forEach((show) => {
        delete state.movies[show.movie.ids.trakt];
      });
    },
    updateTranslation(
      state,
      {
        payload,
      }: PayloadAction<{
        translation: { title: string; overview: string };
        id: number;
      }>
    ) {
      const storedShow = state.movies[payload.id];
      if (storedShow) {
        storedShow.movie.title = payload.translation.title;
        storedShow.movie.overview = payload.translation.overview;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWatched.pending, (state, { meta }) => {
        state.pending.watched.push(meta.arg.movie.ids.trakt);
      })
      .addCase(addWatched.fulfilled, (state, { payload, meta }) => {
        if (payload?.added.movies) {
          state.movies[meta.arg.movie.ids.trakt] = {
            movie: meta.arg.movie,
            type: 'movie',
            watched_at: new Date().toISOString(),
            localState: 'watched',
          };
        }
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(addWatched.rejected, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(removeWatched.pending, (state, { meta }) => {
        state.pending.watched.push(meta.arg.movie.ids.trakt);
      })
      .addCase(removeWatched.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.movies) {
          delete state.movies[meta.arg.movie.ids.trakt];
        }
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(removeWatched.rejected, (state, { meta }) => {
        state.pending.watched = state.pending.watched.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(addWatchlistThunk.pending, (state, { meta }) => {
        state.pending.watchlist.push(meta.arg.movie.ids.trakt);
      })
      .addCase(addWatchlistThunk.fulfilled, (state, { payload, meta }) => {
        if (payload?.added.movies) {
          state.movies[meta.arg.movie.ids.trakt] = {
            movie: meta.arg.movie,
            type: 'movie',
            listed_at: new Date().toISOString(),
            localState: 'watchlist',
          };
          state.pending.watchlist = state.pending.watchlist.filter(
            (p) => p !== meta.arg.movie.ids.trakt
          );
        }
      })
      .addCase(addWatchlistThunk.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(removeWatchlistThunk.pending, (state, { meta }) => {
        state.pending.watchlist.push(meta.arg.movie.ids.trakt);
      })
      .addCase(removeWatchlistThunk.fulfilled, (state, { payload, meta }) => {
        if (payload?.deleted.movies) {
          delete state.movies[meta.arg.movie.ids.trakt];
        }
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(removeWatchlistThunk.rejected, (state, { meta }) => {
        state.pending.watchlist = state.pending.watchlist.filter(
          (p) => p !== meta.arg.movie.ids.trakt
        );
      })
      .addCase(getMovie.fulfilled, (state, { payload }) => {
        state.movies[payload.ids.trakt] = {
          ...state.movies[payload.ids.trakt],
          movie: payload,
        };
      })
      .addCase(populateDetail.pending, (state) => {
        state.detail = undefined;
      })
      .addCase(populateDetail.fulfilled, (state, { payload }) => {
        state.detail = payload;
      })
      .addCase(populateDetail.rejected, (state) => {
        state.detail = undefined;
      });
  },
});

// actions
export const { set, remove, updateTranslation } = moviesSlice.actions;

// reducer
export const reducer = moviesSlice.reducer;

// selectors
export const byType = createSelector(
  (state: RootState) => state.movies.movies,
  (movies) => {
    return Object.values(movies).reduce(
      (
        acc: {
          watchlist: MovieWatchlist[];
          watched: MovieWatched[];
        },
        s
      ) => {
        if (!s.localState) {
          return acc;
        }
        acc[s.localState].push(s as any);
        return acc;
      },
      { watchlist: [], watched: [] }
    );
  }
);

export const totalByType = createSelector(byType, ({ watchlist, watched }) => {
  return { watchlist: watchlist.length, watched: watched.length };
});
