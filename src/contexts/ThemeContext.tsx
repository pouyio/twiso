import React, { createContext, useState, ReactNode } from 'react';
import Helmet from 'react-helmet';

export type ThemeType = 'theme-light' | 'theme-dark';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme?: ThemeType) => void;
}

export const ThemeContext = createContext<Partial<ThemeContextProps>>({});

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<React.PropsWithChildren<
  IThemeProviderProps
>> = ({ children }) => {
  const [localTheme, setLocalTheme] = useState<ThemeType | undefined>(
    localStorage.getItem('theme') as ThemeType
  );

  const setTheme = (newTheme?: ThemeType) => {
    if (newTheme) {
      localStorage.setItem('theme', newTheme);
    } else {
      localStorage.removeItem('theme');
    }
    setLocalTheme(newTheme);
  };

  const styles = () => {
    return {
      style: (window.navigator as any).standalone ? { minHeight: '100vh' } : {},
    };
  };

  return (
    <ThemeContext.Provider value={{ theme: localTheme, setTheme }}>
      <div
        className={`theme-wrapper text-black bg-white ${localTheme ?? ''}`}
        {...styles()}
      >
        <Helmet>
          {localTheme && (
            <style type="text/css">{`
              body {
                background-color: ${
                  localTheme === 'theme-dark' ? 'black' : 'white'
                };
              }
          `}</style>
          )}
        </Helmet>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
