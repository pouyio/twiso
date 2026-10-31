import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
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
    expect(container.querySelector('#safe-bottom')).toBeInTheDocument();
  });

  it('uses #content as the vertical scroll container', () => {
    const { container } = renderApp();
    const content = container.querySelector('#content') as HTMLElement;

    const styles = getComputedStyle(content);
    expect(styles.overflowY).toBe('auto');
    expect(styles.overflowX).toBe('hidden');
  });
});
