import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeContext, ThemeProvider } from './ThemeContext';

const ThemeButton = () => {
  const { setTheme } = useContext(ThemeContext);

  return (
    <button type="button" onClick={() => setTheme?.('theme-dark')}>
      Dark
    </button>
  );
};

const getThemeColor = () =>
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content;

beforeEach(() => {
  localStorage.removeItem('theme');
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.remove());
  document.documentElement.classList.remove('theme-dark', 'theme-light');
});

afterEach(() => {
  cleanup();
  localStorage.removeItem('theme');
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.remove());
  document.documentElement.classList.remove('theme-dark', 'theme-light');
});

describe('ThemeProvider', () => {
  it('paints the light status bar white', async () => {
    localStorage.setItem('theme', 'theme-light');
    render(<ThemeProvider>content</ThemeProvider>);

    await screen.findByText('content');
    expect(getThemeColor()).toBe('#ffffff');
  });

  it('paints the dark status bar black and creates the meta tag if absent', async () => {
    localStorage.setItem('theme', 'theme-dark');
    render(<ThemeProvider>content</ThemeProvider>);

    await screen.findByText('content');
    expect(getThemeColor()).toBe('#000000');
  });

  it('updates the status bar color when the theme changes', async () => {
    localStorage.setItem('theme', 'theme-light');
    render(
      <ThemeProvider>
        <ThemeButton />
      </ThemeProvider>
    );

    expect(getThemeColor()).toBe('#ffffff');
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(getThemeColor()).toBe('#000000');
    expect(localStorage.getItem('theme')).toBe('theme-dark');
  });
});
