import { motion } from 'framer-motion';
import { useResize, useTranslate, useWindowSize } from '../../hooks';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Emoji from '../Emoji';
import LongPress from '../Longpress';

export const NavigationTabs: React.FC<{
  logged: boolean;
}> = ({ logged }) => {
  const { pathname } = useLocation();
  const { bounds, ref } = useResize();
  const [slider, setSlider] = useState({ left: 0, width: 0 });
  const refs = useRef(
    new Map<string, HTMLLIElement | null>([
      ['/shows', null],
      ['/search', null],
      ['/calendar', null],
      ['/profile', null],
      ['/movies', null],
    ])
  );
  const { width } = useWindowSize();
  const { t } = useTranslate();

  useEffect(() => {
    const target = refs.current.get(pathname);
    if (target) {
      const tRect = target.getBoundingClientRect();

      setSlider({
        left: tRect.left,
        width: tRect.width,
      });
    }
  }, [pathname, bounds]);

  return (
    <>
      <ul
        className="flex justify-around px-2 text-center bg-gray-200"
        style={{
          ...(width >= 1024
            ? { paddingTop: 'env(safe-area-inset-top)' }
            : { paddingBottom: 'env(safe-area-inset-bottom)' }),
        }}
        ref={ref}
      >
        {logged ? (
          <>
            <li
              className="py-1"
              onClick={() => window.scrollTo(0, 0)}
              ref={(el) => refs.current.set('/movies', el)}
            >
              <NavLink
                to="/movies?mode=watchlist&page=1"
                className="flex items-center"
              >
                <Emoji emoji="🎬" />
                <span className="ml-2 text-base hidden lg:inline">
                  {t('movies')}
                </span>
              </NavLink>
            </li>
            <li
              className="py-1"
              onClick={() => window.scrollTo(0, 0)}
              ref={(el) => refs.current.set('/shows', el)}
            >
              <NavLink
                to="/shows?mode=watched&page=1"
                className="flex items-center"
              >
                <Emoji emoji="📺" />
                <span className="ml-2 text-base hidden lg:inline">
                  {t('shows')}
                </span>
              </NavLink>
            </li>
          </>
        ) : null}
        <li
          className="py-1"
          onClick={() => window.scrollTo(0, 0)}
          ref={(el) => refs.current.set('/search', el)}
        >
          <LongPress />
        </li>
        {logged ? (
          <li
            className="py-1"
            onClick={() => window.scrollTo(0, 0)}
            ref={(el) => refs.current.set('/calendar', el)}
          >
            <NavLink to="/calendar" className="flex items-center">
              <Emoji emoji="📅" />
              <span className="ml-2 text-base hidden lg:inline">
                {t('calendar')}
              </span>
            </NavLink>
          </li>
        ) : null}
        <li className="py-1" ref={(el) => refs.current.set('/profile', el)}>
          <NavLink to="/profile" className="flex items-center">
            <Emoji emoji="👤" />
            <span className="ml-2 text-base hidden lg:inline">
              {t('profile')}
            </span>
          </NavLink>
        </li>
      </ul>
      <motion.div
        className="absolute bg-gray-600 bottom-0 rounded"
        initial={false}
        style={{
          bottom:
            width < 1024 ? `calc(env(safe-area-inset-bottom) + 4px)` : '4px',
          height: '2px',
          width: slider.width,
        }}
        animate={{
          left: slider.left,
        }}
      />
    </>
  );
};
