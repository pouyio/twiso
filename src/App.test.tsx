import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { page } from 'vitest/browser';
import { store } from './state/store';
import App from './App';
import './index.css';

const renderApp = () =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
  });

  it('renders layout structure', () => {
    const { container } = renderApp();

    expect(container.querySelector('#app-shell')).toBeInTheDocument();
    expect(container.querySelector('#safe-top')).toBeInTheDocument();
    expect(container.querySelector('#navbar')).toBeInTheDocument();
    expect(container.querySelector('#view')).toBeInTheDocument();
    expect(container.querySelector('#content')).toBeInTheDocument();
  });

  it('uses #content as the vertical scroll container', () => {
    const { container } = renderApp();
    const content = container.querySelector('#content') as HTMLElement;

    const styles = getComputedStyle(content);
    expect(styles.overflowY).toBe('auto');
    expect(styles.overflowX).toBe('hidden');
  });

  it('keeps the nav item padding on mobile and desktop', async () => {
    await page.viewport(390, 844);
    const { container } = renderApp();
    const item = container.querySelector('#navbar li') as HTMLElement;

    expect(getComputedStyle(item).paddingTop).toBe('4px');
    expect(getComputedStyle(item).paddingBottom).toBe('4px');

    await page.viewport(1280, 800);
    expect(getComputedStyle(item).paddingTop).toBe('4px');
    expect(getComputedStyle(item).paddingBottom).toBe('4px');
  });
});
