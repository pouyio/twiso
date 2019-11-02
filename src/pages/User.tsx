import React, { useContext, useEffect, useState } from 'react';
import Emoji from '../components/Emoji';
import ThemeContext from '../utils/ThemeContext';
import { getStatsApi } from '../utils/api';
import { UserStats } from '../models';
import { removeCaches } from '../utils/cache';
import Helmet from 'react-helmet';

export default function User() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [stats, setStats] = useState<UserStats>();

  useEffect(() => {
    // TODO change
    getStatsApi('pouyio').then(({ data }) => setStats(data));
  }, []);

  const logout = () => {
    localStorage.removeItem('session');
    window.location.reload();
  };

  const convertMinutes = (minutes: number) => {
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
    <div className="p-4 lg:max-w-5xl lg:mx-auto">
      <Helmet>
        <title>Profile</title>
      </Helmet>
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
            <button
              onClick={logout}
              className="bg-gray-200 px-2 py-1 rounded-full"
            >
              <Emoji emoji="❌" /> Logout
            </button>
          </li>
        </ul>
        {stats && (
          <>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8">
              <Emoji emoji="🎬" /> Películas
            </h1>
            <p className="text-center">
              Vistas: {stats.movies.watched} en{' '}
              {convertMinutes(stats.movies.minutes)}
            </p>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8">
              <Emoji emoji="📺" /> Episodios
            </h1>
            <p className="text-center">
              Vistos: {stats.episodes.watched} en{' '}
              {convertMinutes(stats.episodes.minutes)}{' '}
            </p>
            <p className="text-center mt-8">
              <button
                onClick={removeCaches}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="♻️" />
                Remove images from cache
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
