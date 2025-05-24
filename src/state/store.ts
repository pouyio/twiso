import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { reducer as moviesReducer } from './slices/movies';
import { reducer as showsReducer } from './slices/shows';
import { reducer as configReducer } from './slices/config';
import { reducer as rootReducer } from './slices/root';
import { dbMiddleware } from './dbMiddleware';
import { useDispatch, useSelector } from 'react-redux';

const reducer = combineReducers({
  root: rootReducer,
  config: configReducer,
  movies: moviesReducer,
  shows: showsReducer,
});

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(dbMiddleware),
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
