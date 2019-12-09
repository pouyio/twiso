import React, { createContext, useState, ReactNode } from 'react';
import Helmet from 'react-helmet';

export type ThemeType = 'theme-light' | 'theme-dark';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<Partial<ThemeContextProps>>({});

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
  const [localTheme, setLocalTheme] = useState<ThemeType>(
    (localStorage.getItem('theme') as ThemeType) || 'theme-light',
  );

  const toggleTheme = () => {
    setLocalTheme(t => {
      const newTheme = t === 'theme-light' ? 'theme-dark' : 'theme-light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const styles = () => {
    return {
      style: (window.navigator as any).standalone
        ? { minHeight: '100vh', paddingTop: 'env(safe-area-inset-top)' }
        : {},
    };
  };

  return (
    <ThemeContext.Provider value={{ theme: localTheme, toggleTheme }}>
      <div
        className={`theme-wrapper text-black bg-white ${localTheme}`}
        {...styles()}
      >
        <Helmet>
          <style type="text/css">{`
            body {
              background: ${localTheme === 'theme-dark' ? 'black' : ''};
            }
          `}</style>
        </Helmet>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
export default ThemeContext;
