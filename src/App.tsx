import React, { useContext, useState, useEffect } from 'react';
import { Route, Redirect, useLocation, NavLink } from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import Search from './pages/search/Search';
import Login from './components/Login';
import MovieDetail from './pages/MovieDetail';
import ShowDetail from './pages/ShowDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Emoji from './components/Emoji';
import { AuthContext } from './contexts';
import Person from './pages/Person';
import Movies from './pages/movies/Movies';
import Profile from './pages/Profile';
import { ProgressBar } from './components/ProgressBar';
import { Alert } from 'components/Alert/Alert';
import { Providers } from 'components/Providers';
import { GlobalSearch } from 'components/GlobalSearch';
import LongPress from 'components/Longpress';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'state/state';
import { firstLoad } from './state/firstLoadAction';
import Shows from 'pages/shows/Shows';
import { loadImgConfig } from 'state/slices/defaultSlice';

const ParamsComponent: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { session } = useContext(AuthContext);

  return session ? (
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

  const globalSearch = useSelector((state: IState) => state.globalSearch);

  const moviesReady = useSelector<IState>((state) => state.movies.ready);
  const showsReady = useSelector<IState>((state) => state.shows.ready);

  const { session } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadImgConfig());
    if (session) {
      firstLoad(session);
    }
    // eslint-disable-next-line
  }, [session]);

  return (
    <div ref={setRef}>
      <Providers modalRef={ref!}>
        <Alert />
        <ul className="navbar flex w-full text-2xl hidden opacity-0 lg:top-0 lg:bottom-auto lg:block select-none">
          <li className="py-1">
            <Emoji emoji="📺" /> P
          </li>
        </ul>
        <nav className="w-full flex flex-col fixed bottom-0 z-20 justify-around text-2xl lg:top-0 lg:bottom-auto select-none">
          <ProgressBar />
          <ul
            className="flex justify-around px-2 text-center bg-gray-200"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {session ? (
              <>
                <li className="py-1" onClick={() => window.scrollTo(0, 0)}>
                  <NavLink
                    activeClassName="selected-nav-item"
                    to="/movies?mode=watchlist&page=1"
                    className="flex items-center"
                  >
                    <Emoji emoji="🎬" />
                    <span className="ml-2 text-base hidden lg:inline">
                      Películas
                    </span>
                  </NavLink>
                </li>
                <li className="py-1" onClick={() => window.scrollTo(0, 0)}>
                  <NavLink
                    activeClassName="selected-nav-item"
                    to="/shows?mode=watched&page=1"
                    className="flex items-center"
                  >
                    <Emoji emoji="📺" />
                    <span className="ml-2 text-base hidden lg:inline">
                      Series
                    </span>
                  </NavLink>
                </li>
              </>
            ) : null}
            <li className="py-1" onClick={() => window.scrollTo(0, 0)}>
              <LongPress />
            </li>
            <li className="py-1">
              <NavLink
                activeClassName="selected-nav-item"
                to="/profile"
                className="flex items-center"
              >
                <Emoji emoji="👤" />
                <span className="ml-2 text-base hidden lg:inline">Perfil</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <>
          {globalSearch && <GlobalSearch />}
          <Route exact path="/">
            <ParamsComponent />
          </Route>
          <ProtectedRoute path="/movies">
            {moviesReady ? <Movies /> : <h1>Cargando películas!</h1>}
          </ProtectedRoute>
          <ProtectedRoute path="/shows">
            {showsReady ? <Shows /> : <h1>Cargando series!</h1>}
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
          <ul
            className="navbar flex w-full text-2xl opacity-0 lg:top-0 lg:bottom-auto lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <li className="py-1">
              <Emoji emoji="📺" />P
            </li>
          </ul>
        </>
      </Providers>
    </div>
  );
};

export default App;
