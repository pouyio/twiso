import { initialState } from './state';
import { createReducer } from '@reduxjs/toolkit';
import {
  setWatchedShows,
  removeWatchedShow,
  addWatchlistShow,
  removeWatchlistShow,
  updateShowProgress,
  updateShowSeasons,
  showsReady,
  setTotalLoadingShows,
  updateTotalLoadingShows,
  setGlobalSearch,
} from './action-redux';

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setWatchedShows, (state, action) => {
      state.shows.watched = action.payload;
    })
    .addCase(removeWatchedShow, (state, action) => {
      const oldShows = state.shows.watched.filter(
        (om) => action.payload.ids.trakt !== om.show.ids.trakt
      );
      state.shows.watched = [...oldShows];
    })
    .addCase(addWatchlistShow, (state, action) => {
      state.shows.watchlist.concat(action.payload);
    })
    .addCase(removeWatchlistShow, (state, action) => {
      const oldShows = state.shows.watchlist.filter(
        (om) => action.payload.ids.trakt !== om.show.ids.trakt
      );
      state.shows.watchlist = [...oldShows];
    })
    .addCase(updateShowProgress, (state, action) => {
      const showIndex = state.shows.watched.findIndex(
        (s) => s.show.ids.trakt === action.payload.show.show.ids.trakt
      );
      if (showIndex === -1) {
        state.shows.watched.push({
          ...action.payload.show,
          progress: action.payload.progress,
        });
      } else {
        state.shows.watched[showIndex].progress = action.payload.progress;
      }
    })
    .addCase(updateShowSeasons, (state, action) => {
      const showIndex = state.shows.watched.findIndex(
        (s) => s.show.ids.trakt === action.payload.show.show.ids.trakt
      );
      if (showIndex === -1) {
        state.shows.watched.push({
          ...action.payload.show,
          fullSeasons: action.payload.seasons,
        });
      } else {
        state.shows.watched[showIndex].fullSeasons = action.payload.seasons;
      }
    })
    .addCase(showsReady, (state) => {
      state.shows.ready = true;
    })
    .addCase(setTotalLoadingShows, (state, action) => {
      state.loading.shows.total = action.payload;
    })
    .addCase(updateTotalLoadingShows, (state, action) => {
      state.loading.shows.current =
        action.payload ?? ++state.loading.shows.current;
    })
    .addCase(setGlobalSearch, (state, action) => {
      state.globalSearch = !!action.payload;
    })
);
