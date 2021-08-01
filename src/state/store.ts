import { configureStore } from '@reduxjs/toolkit';
import { reducer as moviesReducer } from './slices/movies';
import { reducer as showsReducer } from './slices/shows';
import { reducer as configReducer } from './slices/config';
import { reducer as rootReducer } from './slices/root';
import { dbMiddleware } from './middleware';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    root: rootReducer,
    config: configReducer,
    movies: moviesReducer,
    shows: showsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(dbMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
