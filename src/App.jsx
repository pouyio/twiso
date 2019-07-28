import './index.css';
import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Watchlist from './components/Watchlist'
import Watched from './components/Watched';
import Search from './components/Search';
import Login from './components/Login'
import MovieDetail from './components/MovieDetail'
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserProvider } from './utils/UserContext';
import { AuthProvider } from './utils/AuthContext';
import Emoji from './components/Emoji';

function ParamsComponent({ location, history }) {

  const params = new URLSearchParams(location.search);

  return (
    <div>
      {
        params.get("code") ?
          <Login code={params.get("code")} history={history} />
          : <a href="https://trakt.tv/oauth/authorize?response_type=code&client_id=61afe7ed7ef7a2b6b2193254dd1cca580ba8dee91490df454d78fd68aed7e5f9&redirect_uri=http://localhost:3000">Login</a>
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
          <ul className="navbar flex w-full bg-gray-200 fixed bottom-0 py-4 px-2 z-10">
            <li>
              <Link to="/watchlist">
                <Emoji emoji={'📺'} /> Pendientes</Link>
            </li>
            <li>
              <Link to="/watched">
                <Emoji emoji={'📌'} /> Vistas</Link>
            </li>
            <li>
              <Link to="/search">
                <Emoji emoji={'🔍'} /> Buscar</Link>
            </li>
            <li className="flex-grow text-right underline">
              <button onClick={logout}><Emoji emoji={'❌'} /></button>
            </li>
          </ul>          
          <Route exact path="/" component={ParamsComponent} />
          <ProtectedRoute path="/watchlist" component={Watchlist} />
          <ProtectedRoute path="/watched" component={Watched} />
          <ProtectedRoute path="/search" component={Search} />
          <ProtectedRoute path="/movie/:id" component={MovieDetail} />
          <ul className="navbar flex w-full py-4 opacity-0">
            <li>
                <Emoji emoji={'📺'} /> P
            </li>
          </ul>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
