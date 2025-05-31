import { motion } from 'motion/react';
import React from 'react';
import { NavLink, useLocation } from 'react-router';
import LongPress from '../Longpress';
import { ROUTES } from 'utils/routes';
import { Icon } from 'components/Icon';
import { useTranslate } from '../../hooks/useTranslate';

const Underline: React.FC = () => {
  return (
    <motion.div
      layoutId="underline-section"
      className="bg-gray-600 rounded-sm bottom-[calc(env(safe-area-inset-bottom)_+_4px)] h-[2px]"
      initial={false}
    />
  );
};

export const NavigationTabs: React.FC<{
  logged: boolean;
}> = ({ logged }) => {
  const { pathname } = useLocation();
  const { t } = useTranslate();

  return (
    <ul className="flex justify-around px-2 text-center">
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
            {pathname.startsWith(ROUTES.movies) && <Underline />}
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
            {pathname.startsWith(ROUTES.shows) && <Underline />}
          </li>
        </>
      ) : null}
      <li className="py-1">
        <LongPress />
        {pathname.startsWith(ROUTES.search) && <Underline />}
      </li>
      <li className="py-1">
        <NavLink to={ROUTES.profile} className="flex items-center">
          <Icon name="profile" className="h-8" />
          <span className="ml-2 text-base hidden lg:inline">
            {t('profile')}
          </span>
        </NavLink>
        {pathname.startsWith(ROUTES.profile) && <Underline />}
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
