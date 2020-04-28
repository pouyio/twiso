import React, { createContext, useState, ReactNode, useEffect } from 'react';
import Head from 'next/head';
import { isServer } from '../utils/isServer';

export type ThemeType = 'theme-light' | 'theme-dark';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<Partial<ThemeContextProps>>({});

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
  const [localTheme, setLocalTheme] = useState<ThemeType>('theme-dark');

  useEffect(() => {
    const localTheme = localStorage.getItem('theme') as ThemeType;
    if (localTheme) {
      setLocalTheme(localTheme);
    }
  }, []);

  const toggleTheme = () => {
    setLocalTheme((t) => {
      const newTheme = t === 'theme-light' ? 'theme-dark' : 'theme-light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const styles = () => {
    if (isServer()) {
      return {};
    }
    return {
      style: (window.navigator as any).standalone ? { minHeight: '100vh' } : {},
    };
  };

  return (
    <ThemeContext.Provider value={{ theme: localTheme, toggleTheme }}>
      <div
        className={`theme-wrapper text-black bg-white ${localTheme}`}
        {...styles()}
      >
        <Head>
          <style type="text/css">{`
            body {
              background: ${localTheme === 'theme-dark' ? 'black' : ''};
            }
          `}</style>
        </Head>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
