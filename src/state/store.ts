import {
  configureStore,
  createReducer,
  createAction,
  combineReducers,
} from '@reduxjs/toolkit';
import { reducer as moviesReducer } from './slices/moviesSlice';
import { reducer as showsReducer } from './slices/showsSlice';
import { reducer as configReducer } from './slices/configSlice';
import { initialState } from './state';
import { dbMiddleware } from './middleware';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const setTotalLoadingShows = createAction<number>(
  'SET_TOTAL_LOADING_SHOWS'
);

export const setTotalLoadingMovies = createAction<number>(
  'SET_TOTAL_LOADING_MOVIES'
);

export const updateTotalLoadingShows = createAction<number | undefined>(
  'UPDATE_TOTAL_LOADING_SHOWS'
);

export const updateTotalLoadingMovies = createAction<number | undefined>(
  'UPDATE_TOTAL_LOADING_MOVIES'
);

export const setGlobalSearch = createAction<boolean>('SET_GLOBAL_SEARCH');
export const setSWRegistration = createAction<ServiceWorkerRegistration>(
  'SET_SW_REGISTRATION'
);

export const store = configureStore({
  reducer: combineReducers({
    loading: createReducer(initialState.loading, (builder) =>
      builder
        .addCase(setTotalLoadingShows, (state, { payload }) => {
          state.shows.total = payload;
        })
        .addCase(updateTotalLoadingShows, (state, { payload }) => {
          state.shows.current = payload ?? state.shows.current + 1;
        })
        .addCase(setTotalLoadingMovies, (state, { payload }) => {
          state.movies.total = payload;
        })
        .addCase(updateTotalLoadingMovies, (state, { payload }) => {
          state.movies.current = payload ?? state.movies.current + 1;
        })
    ),
    globalSearch: createReducer(initialState.globalSearch, (builder) =>
      builder.addCase(setGlobalSearch, (_, { payload }) => payload)
    ),
    serviceWorkerRegistration: createReducer<ServiceWorkerRegistration | null>(
      initialState.serviceWorkerRegistration,
      (builder) =>
        builder.addCase(setSWRegistration, (_, { payload }) => payload)
    ),
    config: configReducer,
    movies: moviesReducer,
    shows: showsReducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dbMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
