import './index.css';
import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Watchlist from './components/Watchlist'
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
            <ul className="navbar flex w-full bg-gray-200 fixed bottom-0 px-4 z-50 text-center justify-around">
              <li>
                <Link to="/shows">
                  <Emoji className="text-3xl" emoji="📺" /></Link>
              </li>
              <li>
                <Link to="/watchlist">
                  <Emoji className="text-3xl" emoji="⏱" /></Link>
              </li>
              <li>
                <Link to="/watched">
                  <Emoji className="text-3xl" emoji="📚" /></Link>
              </li>
              <li>
                <Link to="/search">
                  <Emoji className="text-3xl" emoji="🔍" /></Link>
              </li>
              <li>
                <button onClick={logout}><Emoji className="text-3xl" emoji="❌" /></button>
              </li>
            </ul>
            <Route exact path="/" component={ParamsComponent} />
            <ProtectedRoute path="/watchlist" component={Watchlist} />
            <ProtectedRoute path="/watched" component={Watched} />
            <ProtectedRoute path="/search" component={Search} />
            <ProtectedRoute path="/movie/:id" component={MovieDetail} />
            <ProtectedRoute path="/shows" component={Shows} />
            <ProtectedRoute path="/show/:id" component={ShowDetail} />
            <ul className="navbar flex w-full py-4 opacity-0">
              <li>
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
