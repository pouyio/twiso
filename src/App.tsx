import { Alert } from 'components/Alert/Alert';
import { GlobalFilter } from 'components/GlobalFilter';
import { NavigationTabs } from 'components/Navigation/NavigationTabs';
import { NewVersion } from 'components/NewVersion';
import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router';
import { loadImgConfig } from 'state/slices/config';
import { useAppDispatch, useAppSelector } from 'state/store';
import { ROUTE, ROUTES } from 'utils/routes';
import Emoji from './components/Emoji';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import ProtectedRoute from './components/ProtectedRoute';
import { firstLoad } from './state/firstLoadAction';
import { AuthContext } from './contexts/AuthContext';
import { useWindowSize } from './hooks/useWindowSize';
import { supabase } from 'utils/supabase';
import { AuthOtpResponse } from '@supabase/supabase-js';
const Movies = lazy(() => import('./pages/movies/Movies'));
const Profile = lazy(() => import('./pages/Profile'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const ShowDetail = lazy(() => import('./pages/ShowDetail'));
const Person = lazy(() => import('./pages/Person'));
const Shows = lazy(() => import('./pages/shows/Shows'));
const Search = lazy(() => import('./pages/search/Search'));

const SessionRedirect: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { session } = useContext(AuthContext);

  return !!session ? <Navigate to="/movies" /> : <Navigate to="/login" />;
};

const Login: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { session } = useContext(AuthContext);
  const [response, setResponse] = useState<AuthOtpResponse>();
  const onSend = async (formData: FormData) => {
    const email = formData.get('email') as string;
    supabase.auth
      .signInWithOtp({
        email,
      })
      .then((data) => setResponse(data));
  };

  if (session) {
    return <Navigate to="/movies" />;
  }

  return (
    <form className="p-10" action={onSend}>
      <label htmlFor="email">Email</label>
      {response ? (
        <p>
          {response.error
            ? response.error.message
            : 'Code sent to your email, click in the link to log in!'}
        </p>
      ) : (
        <>
          <input
            name="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />

          <button
            type="submit"
            className="disabled:opacity-50 bg-gray-400 disabled:cursor-not-allowed cursor-pointer rounded-sm text-center px-8 py-2"
          >
            Log in with a Magic link ✨
          </button>
        </>
      )}
    </form>
  );
};

const MagicLink: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token_hash = params.get('token_hash');

  useEffect(() => {
    if (token_hash) {
      supabase.auth
        .verifyOtp({
          token_hash,
          type: 'email',
        })
        .then(({ error }) => {
          if (error) {
            console.error(error);
            navigate('/profile');
          } else {
            navigate('/movies');
          }
        });
    } else {
      navigate('/profile');
    }
  }, [token_hash]);

  return <div className="text-center pt-20">Loading session...</div>;
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
  }, [isLoggedIn]);

  return (
    <>
      <NewVersion />
      <Alert />
      <ul
        className="navbar w-full text-2xl hidden opacity-0 lg:top-0 lg:bottom-auto lg:block select-none"
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
            <Route path="/" element={<SessionRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/confirm" element={<MagicLink />} />
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
