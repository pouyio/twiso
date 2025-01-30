import { Icon } from 'components/Icon';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Language, changeLanguage } from 'state/slices/config';
import { useAppDispatch, useAppSelector } from 'state/store';
import packageInfo from '../../package.json';
import Emoji from '../components/Emoji';
import { LoginButton } from '../components/LoginButton';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext, ThemeType } from '../contexts/ThemeContext';
import { getProfileApi, getStatsApi } from '../utils/api';
import { removeCaches, removeImgCaches } from '../utils/cache';
import { UserStats } from '../models/Api';
import { useTranslate } from '../hooks/useTranslate';

export default function Profile() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [stats, setStats] = useState<UserStats>();
  const [dev, setDev] = useState(false);
  const { session, logout } = useContext(AuthContext);
  const isLogged = !!session;
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.config.language);
  const { t } = useTranslate();

  useEffect(() => {
    if (isLogged) {
      getStatsApi().then(({ data }) => setStats(data));
      getProfileApi().then(({ data }) =>
        setDev(data.ids.slug === 'pouyio' || data.ids.slug === 'pouyio-test')
      );
    }
  }, [isLogged]);

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
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <Helmet>
        <title>Profile</title>
      </Helmet>
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
        </ul>
        {isLogged ? (
          <>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8 flex justify-center items-center">
              <Icon name="movie" className="h-6 pr-1" /> {t('movies')}
            </h1>
            <p className="text-center">
              {t('have_watched_f')}: {stats && stats.movies.watched} en{' '}
              {convertMinutes(stats && stats.movies.minutes)}
            </p>
            <h1 className="text-2xl text-center text-gray-700 m-4 mt-8 flex justify-center items-center">
              <Icon name="tv" className="h-6 pr-1" /> {t('episodes')}
            </h1>
            <p className="text-center">
              {t('have_watched')}: {stats && stats.episodes.watched} en{' '}
              {convertMinutes(stats && stats.episodes.minutes)}{' '}
            </p>{' '}
          </>
        ) : null}

        <div className="flex justify-between pt-10 text-sm font-mono">
          <h1 className="inline">Version: {packageInfo.version}</h1>
          <a href="https://status.trakt.tv/" className="underline">
            API status
          </a>
          {isLogged ? (
            <button
              onClick={logout}
              className="bg-gray-200 px-4 py-1 pl-2 rounded-full flex items-center"
            >
              <Icon name="logout" className="h-6 pr-1" /> Logout
            </button>
          ) : (
            <LoginButton small />
          )}
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
