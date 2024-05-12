import { Alert } from 'components/Alert/Alert';
import { GlobalFilter } from 'components/GlobalFilter';
import { NavigationTabs } from 'components/Navigation/NavigationTabs';
import { NewVersion } from 'components/NewVersion';
import { AuthContext } from 'contexts';
import React, { Suspense, lazy, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { loadImgConfig } from 'state/slices/config';
import { useAppDispatch, useAppSelector } from 'state/store';
import { ROUTE, ROUTES } from 'utils/routes';
import Emoji from './components/Emoji';
import Login from './components/Login';
import { ProgressBar } from './components/ProgressBar';
import ProtectedRoute from './components/ProtectedRoute';
import { useWindowSize } from './hooks';
import { firstLoad } from './state/firstLoadAction';
const Movies = lazy(() => import('./pages/movies/Movies'));
const Profile = lazy(() => import('./pages/Profile'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const ShowDetail = lazy(() => import('./pages/ShowDetail'));
const Person = lazy(() => import('./pages/Person'));
const Shows = lazy(() => import('./pages/shows/Shows'));
const Search = lazy(() => import('./pages/search/Search'));
const Calendar = lazy(() => import('./pages/calendar/Calendar'));

const ParamsComponent: React.FC<React.PropsWithChildren<unknown>> = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { session } = useContext(AuthContext);

  return !!session ? (
    <Navigate to="/movies" />
  ) : (
    <div className="text-center pt-20">
      {params.get('code') ? (
        <Login code={params.get('code') || ''} />
      ) : (
        <Navigate to="/search" />
      )}
    </div>
  );
};

const App: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { width: windowWidth } = useWindowSize();

  const globalSearch = useAppSelector((state) => state.root.globalSearch);

  const { session } = useContext(AuthContext);
  const isLoggedIn = !!session;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadImgConfig());
    if (isLoggedIn) {
      firstLoad();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  return (
    <>
      <NewVersion />
      <Alert />
      <ul
        className="navbar flex w-full text-2xl hidden opacity-0 lg:top-0 lg:bottom-auto lg:block select-none"
        style={{
          ...(windowWidth >= 1024
            ? { paddingTop: 'env(safe-area-inset-top)' }
            : {}),
        }}
      >
        <li className="py-1">
          <Emoji emoji="📺" /> P
        </li>
      </ul>
      <nav className="w-full flex flex-col lg:flex-col-reverse fixed bottom-0 z-20 justify-around text-2xl lg:top-0 lg:bottom-auto select-none">
        <ProgressBar />
        <NavigationTabs logged={isLoggedIn} />
      </nav>
      <>
        {globalSearch && <GlobalFilter />}
        <Suspense
          fallback={
            <div
              className="flex justify-center text-6xl items-center"
              style={{ marginTop: 'env(safe-area-inset-top)' }}
            >
              <Emoji emoji="⏳" rotating={true} />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ParamsComponent />} />
            <Route
              path={ROUTES.movies}
              element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.shows}
              element={
                <ProtectedRoute>
                  <Shows />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.calendar}
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route path={ROUTES.search} element={<Search />} />
            <Route path={ROUTE.movie} element={<MovieDetail />} />
            <Route path={ROUTE.show} element={<ShowDetail />} />
            <Route path={ROUTE.person} element={<Person />} />
            <Route path={ROUTES.profile} element={<Profile />} />
          </Routes>
        </Suspense>
        <ul
          className="navbar flex w-full text-2xl opacity-0 lg:top-0 lg:bottom-auto lg:hidden"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
            ...(windowWidth >= 1024
              ? { paddingTop: 'env(safe-area-inset-top)' }
              : {}),
          }}
        >
          <li className="py-1">
            <Emoji emoji="📺" />P
          </li>
        </ul>
      </>
    </>
  );
};

export default App;
