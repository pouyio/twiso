import React, { createContext, useState, ReactNode, useEffect } from 'react';

export type ThemeType = 'theme-light' | 'theme-dark';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme?: ThemeType) => void;
}

export const ThemeContext = createContext<Partial<ThemeContextProps>>({});

interface IThemeProviderProps {
  children: ReactNode;
}

const styles = () => {
  return {
    style: (window.navigator as any).standalone ? { minHeight: '100vh' } : {},
  };
};

export const ThemeProvider: React.FC<
  React.PropsWithChildren<IThemeProviderProps>
> = ({ children }) => {
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

  useEffect(() => {
    const finalTheme =
      localTheme ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'theme-dark'
        : 'theme-light');

    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(finalTheme);
  }, [localTheme]);

  return (
    <ThemeContext value={{ theme: localTheme, setTheme }}>
      <div className="theme-wrapper text-black bg-white" {...styles()}>
        {children}
      </div>
    </ThemeContext>
  );
};
