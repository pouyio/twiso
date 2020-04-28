import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts';
import { useGlobalState } from '../state/store';
import Emoji from './Emoji';
import { ProgressBar } from './ProgressBar';
import { useRouter } from 'next/router';

export const App: React.FC = ({ children }) => {
  const {
    actions: { firstLoad },
  } = useGlobalState();
  const { pathname } = useRouter();

  const { session } = useContext(AuthContext);

  useEffect(() => {
    firstLoad(session);
  }, [session]);

  return (
    <>
      <ul className="navbar flex w-full text-2xl hidden opacity-0 lg:top-0 lg:bottom-auto lg:block">
        <li className="py-1">
          <Emoji emoji="📺" /> P
        </li>
      </ul>
      <nav className="w-full flex flex-col fixed bottom-0 z-50 justify-around text-2xl lg:top-0 lg:bottom-auto">
        <ProgressBar />
        <ul
          className="flex justify-around px-2 text-center bg-gray-200"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {session ? (
            <>
              <li className="py-1">
                <Link href="/movie?mode=watchlist&page=1">
                  <a
                    className={`flex items-center ${
                      pathname === '/movie' ? 'selected-nav-item' : ''
                    }`}
                  >
                    <Emoji emoji="🎬" />
                    <span className="ml-2 text-base hidden lg:inline">
                      Películas
                    </span>
                  </a>
                </Link>
              </li>
              <li className="py-1">
                <Link href="/show?mode=watched&page=1">
                  <a
                    className={`flex items-center ${
                      pathname === '/show' ? 'selected-nav-item' : ''
                    }`}
                  >
                    <Emoji emoji="📺" />
                    <span className="ml-2 text-base hidden lg:inline">
                      Series
                    </span>
                  </a>
                </Link>
              </li>
            </>
          ) : null}
          <li className="py-1">
            <Link href="/search">
              <a
                className={`flex items-center ${
                  pathname === '/search' ? 'selected-nav-item' : ''
                }`}
              >
                <Emoji emoji="🔍" />
                <span className="ml-2 text-base hidden lg:inline">Buscar</span>
              </a>
            </Link>
          </li>
          <li className="py-1">
            <Link href="/profile">
              <a
                className={`flex items-center ${
                  pathname === '/profile' ? 'selected-nav-item' : ''
                }`}
              >
                <Emoji emoji="👤" />
                <span className="ml-2 text-base hidden lg:inline">Perfil</span>
              </a>
            </Link>
          </li>
        </ul>{' '}
      </nav>
      {children}
      <ul
        className="navbar flex w-full text-2xl opacity-0 lg:top-0 lg:bottom-auto lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <li className="py-1">
          <Emoji emoji="📺" />P
        </li>
      </ul>
    </>
  );
};
