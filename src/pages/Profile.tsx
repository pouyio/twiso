/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, useEffect, useState } from 'react';
import { version } from '../../package.json';
import Emoji from '../components/Emoji';
import { getStatsApi, getProfileApi } from '../utils/api';
import { UserStats } from '../models';
import { removeImgCaches, removeCaches } from '../utils/cache';
import Helmet from 'react-helmet';
import { ThemeContext, ThemeType } from '../contexts';
import { LoginButton } from '../components/LoginButton';
import { AuthService } from 'utils/AuthService';
import { useDispatch } from 'react-redux';
import { Language, setLanguage } from 'state/slices/config';
import { useAppSelector } from 'state/store';

const authService = AuthService.getInstance();

export default function Profile() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [stats, setStats] = useState<UserStats>();
  const [dev, setDev] = useState(false);
  const isLogged = authService.isLoggedIn();
  const dispatch = useDispatch();
  const language = useAppSelector((state) => state.config.language);

  useEffect(() => {
    if (isLogged) {
      getStatsApi().then(({ data }) => setStats(data));
      getProfileApi().then(({ data }) =>
        setDev(data.ids.slug === 'pouyio' || data.ids.slug === 'pouyio-test')
      );
    }
  }, [isLogged]);

  const logout = () => {
    localStorage.removeItem('session');
    window.location.reload();
  };

  const convertMinutes = (minutes: number = 0) => {
    const d = Math.floor(minutes / 1440);
    const h = Math.floor((minutes - d * 1440) / 60);
    const m = Math.round(minutes % 60);

    if (d > 0) {
      return d + ' días, ' + h + ' horas, ' + m + ' minutos';
    } else {
      return h + ' horas, ' + m + ' minutos';
    }
  };

  return (
    <div
      className="p-4 lg:max-w-5xl lg:mx-auto"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="lg:max-w-lg m-auto">
        <ul className="flex justify-between">
          <li className="py-1 relative">
            <select
              className="cursor-pointer appearance-none bg-white border border-gray-400 px-4 py-1 pr-8 rounded-full leading-tight outline-none"
              onChange={(e) => {
                const value =
                  e.target.value === '0'
                    ? undefined
                    : (e.target.value as ThemeType);
                setTheme!(value);
              }}
              value={theme || '0'}
            >
              <option value="theme-dark">🌚 Dark</option>
              <option value="theme-light">🌞 Light</option>
              <option value="0">🌓 System</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </li>
          <li className="py-1 relative">
            <select
              className="cursor-pointer appearance-none bg-white border border-gray-400 px-4 py-1 pr-8 rounded-full leading-tight outline-none"
              onChange={(e) => {
                dispatch(setLanguage(e.target.value as Language));
              }}
              value={language}
            >
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Español</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </li>
          <li className="py-1">
            {isLogged ? (
              <button
                onClick={logout}
                className="bg-gray-200 px-4 py-1 rounded-full"
              >
                <Emoji emoji="❌" /> Logout
              </button>
            ) : (
              <LoginButton small />
            )}
          </li>
        </ul>
        {isLogged ? (
          <>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8">
              <Emoji emoji="🎬" /> Películas
            </h1>
            <p className="text-center">
              Vistas: {stats && stats.movies.watched} en{' '}
              {convertMinutes(stats && stats.movies.minutes)}
            </p>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8">
              <Emoji emoji="📺" /> Episodios
            </h1>
            <p className="text-center">
              Vistos: {stats && stats.episodes.watched} en{' '}
              {convertMinutes(stats && stats.episodes.minutes)}{' '}
            </p>{' '}
          </>
        ) : null}

        <div className="text-right pt-10 text-sm font-mono">
          <h1>Version: {version}</h1>
        </div>

        {dev ? (
          <>
            <p className="text-center py-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="🌎" />
                Force Reload
              </button>
            </p>
            <p className="text-center py-4">
              <button
                onClick={removeCaches}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="♻️" />
                Remove app cache
              </button>
            </p>
            <p className="text-center py-4">
              <button
                onClick={removeImgCaches}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="♻️" />
                Remove images from cache
              </button>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
