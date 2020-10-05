import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Redirect, useLocation, Switch } from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Emoji from './components/Emoji';
import { ProgressBar } from './components/ProgressBar';
import { Alert } from 'components/Alert/Alert';
import { Providers } from 'components/Providers';
import { GlobalSearch } from 'components/GlobalSearch';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'state/state';
import { firstLoad } from './state/firstLoadAction';
import { loadImgConfig } from 'state/slices/defaultSlice';
import * as Sentry from '@sentry/react';
import { AuthService } from 'utils/AuthService';
import { NewVersion } from 'components/NewVersion';
import { NavigationTabs } from 'components/Navigation/NavigationTabs';
import { useWindowSize } from './hooks';
const Movies = lazy(() => import('./pages/movies/Movies'));
const Profile = lazy(() => import('./pages/Profile'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const ShowDetail = lazy(() => import('./pages/ShowDetail'));
const Person = lazy(() => import('./pages/Person'));
const Shows = lazy(() => import('./pages/shows/Shows'));
const Search = lazy(() => import('./pages/search/Search'));
const Calendar = lazy(() => import('./pages/calendar/Calendar'));

const ParamsComponent: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return AuthService.getInstance().isLoggedIn() ? (
    <Redirect to="/movies" />
  ) : (
    <div className="text-center pt-20">
      {params.get('code') ? (
        <Login code={params.get('code') || ''} />
      ) : (
        <Redirect to="/search" />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>();
  const [skipUpdate, setSkipUpdate] = useState(false);
  const { width: windowWidth } = useWindowSize();

  const globalSearch = useSelector((state: IState) => state.globalSearch);
  const serviceWorkerRegistration = useSelector(
    (state: IState) => state.serviceWorkerRegistration
  );

  const moviesReady = useSelector<IState>((state) => state.movies.ready);
  const showsReady = useSelector<IState>((state) => state.shows.ready);

  const isLoggedIn = AuthService.getInstance().isLoggedIn();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadImgConfig());
    if (isLoggedIn) {
      firstLoad();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const updateServiceWorker = () => {
    if (!serviceWorkerRegistration) {
      return;
    }
    const registrationWaiting = serviceWorkerRegistration.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
      registrationWaiting.addEventListener('statechange', (e) => {
        if ((e.target as ServiceWorker).state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  return (
    <Sentry.ErrorBoundary>
      <div ref={setRef}>
        <Providers modalRef={ref!}>
          {!!serviceWorkerRegistration && !skipUpdate && (
            <NewVersion
              close={() => setSkipUpdate(true)}
              update={updateServiceWorker}
            />
          )}
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
          <nav className="w-full flex flex-col fixed bottom-0 z-20 justify-around text-2xl lg:top-0 lg:bottom-auto select-none">
            <ProgressBar />
            <NavigationTabs logged={isLoggedIn} />
          </nav>
          <>
            {globalSearch && <GlobalSearch />}
            <Route exact path="/">
              <ParamsComponent />
            </Route>
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
              <Switch>
                <ProtectedRoute path="/movies">
                  {moviesReady ? <Movies /> : <h1>Cargando películas!</h1>}
                </ProtectedRoute>
                <ProtectedRoute path="/shows">
                  {showsReady ? <Shows /> : <h1>Cargando series!</h1>}
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
        </Providers>
      </div>
    </Sentry.ErrorBoundary>
  );
};

export default App;
