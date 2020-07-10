import {
  configureStore,
  createReducer,
  getDefaultMiddleware,
  createAction,
} from '@reduxjs/toolkit';
import { reducer as moviesReducer } from './slices/moviesSlice';
import { reducer as showsReducer } from './slices/showsSlice';
import { reducer as defaultReducer } from './slices/defaultSlice';
import { initialState } from './state';
import { dbMiddleware } from './middleware';

export const setTotalLoadingShows = createAction<number>(
  'SET_TOTAL_LOADING_SHOWS'
);

export const updateTotalLoadingShows = createAction<number | undefined>(
  'UPDATE_TOTAL_LOADING_SHOWS'
);

export const setGlobalSearch = createAction<boolean>('SET_GLOBAL_SEARCH');

export const store = configureStore({
  reducer: {
    language: createReducer(initialState.language, {}),
    loading: createReducer(initialState.loading, (builder) =>
      builder
        .addCase(setTotalLoadingShows, (state, { payload }) => {
          state.shows.total = payload;
        })
        .addCase(updateTotalLoadingShows, (state, { payload }) => {
          state.shows.current = payload ?? state.shows.current + 1;
        })
    ),
    globalSearch: createReducer(initialState.globalSearch, (builder) =>
      builder.addCase(setGlobalSearch, (state, { payload }) => payload)
    ),
    config: defaultReducer,
    movies: moviesReducer,
    shows: showsReducer,
  },
  middleware: [...getDefaultMiddleware(), dbMiddleware],
});
