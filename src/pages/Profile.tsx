import { Icon } from 'components/Icon';
import { useContext, useEffect, useState } from 'react';
import { changeLanguage } from 'state/slices/config';
import { useAppDispatch, useAppSelector } from 'state/store';
import packageInfo from '../../package.json';
import Emoji from '../components/Emoji';
import { LoginButton } from '../components/LoginButton';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext, ThemeType } from '../contexts/ThemeContext';
import { getStatsApi } from '../utils/api';
import {
  removeDetailsCaches,
  removeImgCaches,
  removeUserActivities,
  removeUserCaches,
} from '../utils/cache';
import { UserStats } from '../models/Api';
import { AVAIABLE_LANGUAGES, Language } from '../models/Translation';
import { useTranslate } from '../hooks/useTranslate';
import { supabase } from 'utils/supabase';
import { User } from '@supabase/supabase-js';

const AVG_MOVIE_DURATION = 110;
const AVG_EPISODE_DURATION = 35;

export default function Profile() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [stats, setStats] = useState<UserStats>();
  const [dev, setDev] = useState(false);
  const [user, setUser] = useState<User | null>();
  const { session, logout } = useContext(AuthContext);
  const isLogged = !!session;
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.config.language);
  const { t } = useTranslate();

  useEffect(() => {
    if (isLogged) {
      supabase.auth.getUser().then(({ data }) => {
        getStatsApi().then(({ data }) => data && setStats(data));
        setDev(
          ['7904e28b-a8bf-49af-9bc3-6efca4bda7ab'].includes(data.user?.id ?? '')
        );
        setUser(data.user);
      });
    }
  }, [isLogged]);

  const convertMinutes = (minutes: number = 0) => {
    const d = Math.floor(minutes / 1440);
    const h = Math.floor((minutes - d * 1440) / 60);
    const m = Math.round(minutes % 60);

    if (d > 0) {
      return t('days-aprox', d, h, m);
    } else {
      return t('hours-aprox', h, m);
    }
  };

  return (
    <div className="pt-[env(safe-area-inset-top)]">
      <title>Profile</title>
      <div className="lg:max-w-lg m-auto p-4">
        <ul className="flex justify-between">
          <li className="py-1 relative">
            <select
              className="cursor-pointer appearance-none bg-white border border-gray-400 px-4 py-1 pr-8 rounded-full leading-tight outline-hidden"
              onChange={(e) => {
                const value =
                  e.target.value === '0'
                    ? undefined
                    : (e.target.value as ThemeType);
                setTheme!(value);
              }}
              value={theme || '0'}
            >
              <option value="theme-dark">🌚 {t('dark')}</option>
              <option value="theme-light">🌞 {t('light')}</option>
              <option value="0">🌓 {t('system')}</option>
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
              className="cursor-pointer appearance-none bg-white border border-gray-400 px-4 py-1 pr-8 rounded-full leading-tight outline-hidden"
              onChange={(e) => {
                dispatch(
                  changeLanguage({ language: e.target.value as Language })
                );
              }}
              value={language}
            >
              {AVAIABLE_LANGUAGES.map((code) => {
                return (
                  <option key={code} value={code}>
                    {t(code)}
                  </option>
                );
              })}
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
        </ul>
        {isLogged ? (
          <>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8 flex justify-center items-center">
              <Icon name="movie" className="h-6 pr-1" /> {t('movies')}
            </h1>
            <p className="text-center">
              {t('have_watched_f')}: {stats?.movies} en{' '}
              {convertMinutes(stats && stats.movies * AVG_MOVIE_DURATION)}
            </p>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8 flex justify-center items-center">
              <Icon name="tv" className="h-6 pr-1" /> {t('episodes')}
            </h1>
            <p className="text-center">
              {t('have_watched')}: {stats?.episodes} en{' '}
              {convertMinutes(stats && stats.episodes * AVG_EPISODE_DURATION)}{' '}
            </p>{' '}
            <p className="text-sm mt-12 flex flex-col items-end">
              <span>Logged in as:</span>
              <span className="italic h-5">{user?.email}</span>
            </p>
          </>
        ) : null}

        <div className="flex justify-between pt-2 text-sm font-mono items-center">
          <h1 className="inline">Version: {packageInfo.version}</h1>
          <a href="https://status.trakt.tv/" className="underline">
            API status
          </a>
          {isLogged ? (
            <button
              onClick={logout}
              className="bg-gray-200 px-4 py-1 pl-2 rounded-full flex items-center cursor-pointer"
            >
              <Icon name="logout" className="h-6 pr-1" /> Logout
            </button>
          ) : (
            <LoginButton small />
          )}
        </div>

        {dev ? (
          <>
            <h1 className="text-center text-2xl py-4">Dev tools</h1>
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
                onClick={removeUserActivities}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="⚠️" />
                Remove USER activities only
              </button>
            </p>
            <p className="text-center py-4">
              <button
                onClick={removeUserCaches}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="⚠️" />
                Remove USER data
              </button>
            </p>
            <p className="text-center py-4">
              <button
                onClick={removeDetailsCaches}
                className="bg-gray-200 px-2 py-1 rounded-full"
              >
                <Emoji emoji="⚠️" />
                Remove DETAIL data
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
            <a
              className="text-center py-4 underline block"
              href="https://github.com/mbrevda/react-image/pull/1006"
            >
              react-image Pull Request
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
