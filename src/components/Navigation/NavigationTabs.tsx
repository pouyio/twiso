import { motion } from 'motion/react';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LongPress from '../Longpress';
import { ROUTES } from 'utils/routes';
import { Icon } from 'components/Icon';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useTranslate } from '../../hooks/useTranslate';

const Underline: React.FC<{ width: number }> = ({ width }) => {
  return (
    <motion.div
      layoutId="underline-section"
      className="bg-gray-600 rounded"
      initial={false}
      style={{
        bottom:
          width < 1024 ? `calc(env(safe-area-inset-bottom) + 4px)` : '4px',
        height: '2px',
      }}
    />
  );
};

export const NavigationTabs: React.FC<{
  logged: boolean;
}> = ({ logged }) => {
  const { pathname } = useLocation();
  const { width } = useWindowSize();
  const { t } = useTranslate();

  return (
    <ul
      className="flex justify-around px-2 text-center bg-gray-200"
      style={{
        ...(width >= 1024
          ? { paddingTop: 'env(safe-area-inset-top)' }
          : { paddingBottom: 'env(safe-area-inset-bottom)' }),
      }}
    >
      {logged ? (
        <>
          <li className="py-1">
            <NavLink
              to={`${ROUTES.movies}?mode=watchlist&page=1`}
              className="flex items-center"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Icon name="movie" className="h-8" />
              <span className="ml-2 text-base hidden lg:inline">
                {t('movies')}
              </span>
            </NavLink>
            {pathname.startsWith(ROUTES.movies) && <Underline width={width} />}
          </li>
          <li className="py-1">
            <NavLink
              to={`${ROUTES.shows}?mode=watched&page=1`}
              className="flex items-center"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Icon name="tv" className="h-8" />
              <span className="ml-2 text-base hidden lg:inline">
                {t('shows')}
              </span>
            </NavLink>
            {pathname.startsWith(ROUTES.shows) && <Underline width={width} />}
          </li>
        </>
      ) : null}
      <li className="py-1">
        <LongPress />
        {pathname.startsWith(ROUTES.search) && <Underline width={width} />}
      </li>
      {logged ? (
        <li className="py-1">
          <NavLink to={ROUTES.calendar} className="flex items-center">
            <Icon
              name="calendar"
              className="h-8"
              onClick={() => window.scrollTo(0, 0)}
            />
            <span className="ml-2 text-base hidden lg:inline">
              {t('calendar')}
            </span>
          </NavLink>
          {pathname.startsWith(ROUTES.calendar) && <Underline width={width} />}
        </li>
      ) : null}
      <li className="py-1">
        <NavLink to={ROUTES.profile} className="flex items-center">
          <Icon name="profile" className="h-8" />
          <span className="ml-2 text-base hidden lg:inline">
            {t('profile')}
          </span>
        </NavLink>
        {pathname.startsWith(ROUTES.profile) && <Underline width={width} />}
        {!Object.values(ROUTES).includes(pathname) && (
          <div
            style={{
              height: '2px',
              width: 0,
            }}
          />
        )}
      </li>
    </ul>
  );
};
