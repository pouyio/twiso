import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RootState {
  loading: {
    shows: { current: number; total: number };
    movies: { current: number; total: number };
  };
  globalSearch: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

export const initialState: RootState = {
  loading: {
    shows: { current: 0, total: 0 },
    // TODO split in watched & watchlist to show several loaders
    movies: { current: 0, total: 0 },
  },
  globalSearch: false,
  serviceWorkerRegistration: null,
};

const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setTotalLoadingShows(state, { payload }: PayloadAction<number>) {
      state.loading.shows.total = payload;
    },
    updateTotalLoadingShows(
      state,
      { payload }: PayloadAction<number | undefined>
    ) {
      state.loading.shows.current = payload ?? state.loading.shows.current + 1;
    },
    setTotalLoadingMovies(state, { payload }: PayloadAction<number>) {
      state.loading.movies.total = payload;
    },
    updateTotalLoadingMovies(
      state,
      { payload }: PayloadAction<number | undefined>
    ) {
      state.loading.movies.current =
        payload ?? state.loading.movies.current + 1;
    },
    setGlobalSearch(state, { payload }: PayloadAction<boolean>) {
      state.globalSearch = payload;
    },
    setSWRegistration(
      state,
      { payload }: PayloadAction<ServiceWorkerRegistration | null>
    ) {
      state.serviceWorkerRegistration = payload;
    },
  },
});

// actions
export const {
  setTotalLoadingShows,
  setTotalLoadingMovies,
  updateTotalLoadingShows,
  updateTotalLoadingMovies,
  setGlobalSearch,
  setSWRegistration,
} = rootSlice.actions;

// reducer
export const reducer = rootSlice.reducer;
