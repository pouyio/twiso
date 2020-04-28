import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import { version } from '../package.json';
import Emoji from '../components/Emoji';
import { LoginButton } from '../components/LoginButton';
import { AuthContext, ThemeContext } from '../contexts';
import { UserStats } from '../models';
import { getProfileApi, getStatsApi } from '../utils/api';
import { removeCaches, removeImgCaches } from '../utils/cache';

export default function Profile() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [stats, setStats] = useState<UserStats>();
  const [dev, setDev] = useState(false);
  const { session } = useContext(AuthContext);

  useEffect(() => {
    if (session) {
      getStatsApi(session).then(({ data }) => setStats(data));
      getProfileApi(session).then(({ data }) =>
        setDev(data.ids.slug === 'pouyio' || data.ids.slug === 'pouyio-test'),
      );
    }
  }, [session]);

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
      <Head>
        <title>Profile</title>
      </Head>
      <div className="lg:max-w-lg m-auto">
        <ul className="flex justify-between">
          <li className="py-1">
            <button
              onClick={toggleTheme}
              className="bg-gray-200 px-2 py-1 rounded-full"
            >
              <Emoji emoji={theme === 'theme-dark' ? '🌞' : '🌚'} />
              {theme === 'theme-dark' ? 'Light' : 'Dark'} mode
            </button>
          </li>
          <li className="py-1">
            {session ? (
              <button
                onClick={logout}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="❌" /> Logout
              </button>
            ) : (
              <LoginButton small />
            )}
          </li>
        </ul>
        {session ? (
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
