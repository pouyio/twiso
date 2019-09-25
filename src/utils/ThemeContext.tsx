import React, { createContext, useState, ReactNode } from 'react';

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

  return (
    <ThemeContext.Provider value={{ theme: localTheme, toggleTheme }}>
      <div
        className={`theme-wrapper text-black bg-white ${localTheme}`}
        style={{ minHeight: 'calc(100vh - env(safe-area-inset-bottom) - 2em)' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
export default ThemeContext;
