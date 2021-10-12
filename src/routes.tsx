import React, { lazy, useEffect } from 'react';
import ProtectedRoute from 'components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import CacheRoute from 'react-router-cache-route';
import { Route, Switch, useLocation } from 'react-router-dom';
const Movies = lazy(() => import('./pages/movies/Movies'));
const Profile = lazy(() => import('./pages/Profile'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const ShowDetail = lazy(() => import('./pages/ShowDetail'));
const Person = lazy(() => import('./pages/Person'));
const Shows = lazy(() => import('./pages/shows/Shows'));
const Search = lazy(() => import('./pages/search/Search'));
const Calendar = lazy(() => import('./pages/calendar/Calendar'));

export const Routes = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Switch location={location} key={location.pathname}>
        <ProtectedRoute path="/movies">
          <Movies />
        </ProtectedRoute>
        <ProtectedRoute path="/shows">
          <Shows />
        </ProtectedRoute>
        <ProtectedRoute path="/calendar">
          <Calendar />
        </ProtectedRoute>
        <CacheRoute path="/search">
          <Search />
        </CacheRoute>
        <Route path="/movie/:id">
          <MovieDetail />
        </Route>
        <Route path="/show/:id">
          <ShowDetail />
        </Route>
        <Route path="/person/:id">
          <Person />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
    </AnimatePresence>
  );
};
