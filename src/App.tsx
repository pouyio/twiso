import { Alert } from './components/Alert/Alert';
import { GlobalFilter } from './components/GlobalFilter';
import { NavigationTabs } from './components/Navigation/NavigationTabs';
import { NewVersion } from './components/NewVersion';
import React, { Suspense, lazy, useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { loadImgConfig } from './state/slices/config';
import { useAppDispatch, useAppSelector } from './state/store';
import { ROUTE, ROUTES } from './utils/routes';
import Emoji from './components/Emoji';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';
import { VerifyMagicLink } from './pages/VerifyMagicLink';
import { Layout } from './components/Layout';
import { firstLoadThunk } from './state/slices/root';
const Movies = lazy(() => import('./pages/movies/Movies'));
const Profile = lazy(() => import('./pages/Profile'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const ShowDetail = lazy(() => import('./pages/ShowDetail'));
const Person = lazy(() => import('./pages/Person'));
const Shows = lazy(() => import('./pages/shows/Shows'));
const Search = lazy(() => import('./pages/search/Search'));

const SessionRedirect: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { session } = useContext(AuthContext);

  return !!session ? <Navigate to="/movies" /> : <Navigate to="/search" />;
};

const App: React.FC<React.PropsWithChildren<unknown>> = () => {
  const globalSearch = useAppSelector((state) => state.root.globalSearch);
  const { session } = useContext(AuthContext);
  const isLoggedIn = !!session;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadImgConfig());
    if (isLoggedIn) {
      dispatch(firstLoadThunk());
    }
  }, [isLoggedIn]);

  return (
    <>
      <NewVersion />
      <Alert />
      {globalSearch && <GlobalFilter />}
      <Layout.Root>
        <Layout.Navbar>
          <div className="flex flex-col lg:flex-col-reverse bg-gray-200 pb-[env(safe-area-inset-bottom)]">
            <ProgressBar />
            <NavigationTabs logged={isLoggedIn} />
          </div>
        </Layout.Navbar>
        <Layout.Content>
          <Suspense
            fallback={
              <div className="flex justify-center text-6xl items-center pt-5 mt-[env(safe-area-inset-top)]">
                <Emoji emoji="⏳" rotating={true} />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<SessionRedirect />} />
              <Route path="/auth/confirm" element={<VerifyMagicLink />} />
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
              <Route path={ROUTES.search} element={<Search />} />
              <Route path={ROUTE.movie} element={<MovieDetail />} />
              <Route path={ROUTE.show} element={<ShowDetail />} />
              <Route path={ROUTE.person} element={<Person />} />
              <Route path={ROUTES.profile} element={<Profile />} />
            </Routes>
          </Suspense>
        </Layout.Content>
      </Layout.Root>
    </>
  );
};

export default App;
