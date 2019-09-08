import './index.css';
import React, { useContext } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Search from './pages/Search';
import Login from './components/Login';
import MovieDetail from './pages/MovieDetail';
import ShowDetail from './pages/ShowDetail';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserProvider } from './utils/UserContext';
import AuthContext, { AuthProvider } from './utils/AuthContext';
import Emoji from './components/Emoji';
import { ModalProvider } from './utils/ModalContext';
import Person from './components/Person';
import Movies from './pages/movies/Movies';
import Shows from './pages/shows/Shows';
const redirect_url = process.env.REACT_APP_REDIRECT_URL;

function ParamsComponent({ location }) {
  const params = new URLSearchParams(location.search);
  const { session } = useContext(AuthContext);

  return session ? (
    <Redirect to="/movies" />
  ) : (
    <div className="text-center mt-20">
      {params.get('code') ? (
        <Login code={params.get('code')} />
      ) : (
        <a
          className="bg-purple-500 py-3 px-12 rounded-full text-white"
          href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}
        >
          Login
        </a>
      )}
    </div>
  );
}

function App() {
  const logout = () => {
    localStorage.removeItem('session');
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ModalProvider>
            <ul
              className="flex w-full bg-gray-200 fixed bottom-0 px-2 z-50 text-center justify-around text-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <li className="py-1">
                <Link to="/movies">
                  <Emoji emoji="🎬" />
                </Link>
              </li>
              <li className="py-1">
                <Link to="/shows">
                  <Emoji emoji="📺" />
                </Link>
              </li>
              <li className="py-1">
                <Link to="/search">
                  <Emoji emoji="🔍" />
                </Link>
              </li>
              <li className="py-1">
                <button onClick={logout}>
                  <Emoji emoji="❌" />
                </button>
              </li>
            </ul>
            <Route exact path="/" component={ParamsComponent} />
            <ProtectedRoute path="/movies" component={Movies} />
            <ProtectedRoute path="/shows" component={Shows} />
            <ProtectedRoute path="/search" component={Search} />
            <ProtectedRoute path="/movie/:id" component={MovieDetail} />
            <ProtectedRoute path="/show/:id" component={ShowDetail} />
            <ProtectedRoute path="/person/:id" component={Person} />
            <ul className="navbar flex w-full py-4 opacity-0">
              <li className="py-3">
                <Emoji emoji="📺" /> P
              </li>
            </ul>
          </ModalProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
