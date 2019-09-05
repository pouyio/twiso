import './index.css';
import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Watchlist from './components/Watchlist'
import ShowsWatchlist from './components/ShowsWatchlist'
import Watched from './components/Watched';
import Search from './components/Search';
import Login from './components/Login';
import MovieDetail from './components/MovieDetail';
import ShowDetail from './components/ShowDetail';
import Shows from './components/Shows';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserProvider } from './utils/UserContext';
import { AuthProvider } from './utils/AuthContext';
import Emoji from './components/Emoji';
import { ModalProvider } from './utils/ModalContext';
import Person from './components/Person';
const redirect_url = process.env.REACT_APP_REDIRECT_URL;


function ParamsComponent({ location }) {

  const params = new URLSearchParams(location.search);

  return (
    <div className="text-center mt-20">
      {
        params.get("code") ?
          <Login code={params.get("code")} />
          : <a className="bg-purple-500 py-3 px-12 rounded-full text-white" href={`https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=${redirect_url}`}>Login</a>
      }
    </div >
  );
}

function App() {

  const logout = () => {
    localStorage.removeItem('session');
    window.location.reload();
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ModalProvider>
            <ul className="flex w-full bg-gray-200 fixed bottom-0 px-2 z-50 text-center justify-around" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <li className="py-3">
                <Link to="/showsWachlist">
                  <Emoji className="text-3xl" emoji="🖥" /></Link>
              </li>
              <li className="py-3">
                <Link to="/shows">
                  <Emoji className="text-3xl" emoji="📺" /></Link>
              </li>
              <li className="py-3">
                <Link to="/watchlist">
                  <Emoji className="text-3xl" emoji="⏱" /></Link>
              </li>
              <li className="py-3">
                <Link to="/watched">
                  <Emoji className="text-3xl" emoji="📚" /></Link>
              </li>
              <li className="py-3">
                <Link to="/search">
                  <Emoji className="text-3xl" emoji="🔍" /></Link>
              </li>
              <li className="py-3">
                <button onClick={logout}><Emoji className="text-3xl" emoji="❌" /></button>
              </li>
            </ul>
            <Route exact path="/" component={ParamsComponent} />
            <ProtectedRoute path="/showsWachlist" component={ShowsWatchlist} />
            <ProtectedRoute path="/watchlist" component={Watchlist} />
            <ProtectedRoute path="/watched" component={Watched} />
            <ProtectedRoute path="/search" component={Search} />
            <ProtectedRoute path="/movie/:id" component={MovieDetail} />
            <ProtectedRoute path="/shows" component={Shows} />
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
