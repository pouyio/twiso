import '@testing-library/jest-dom';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Layout } from './Layout';
import { LibraryTabs } from './LibraryTabs';
import { store } from '../state/store';

const renderLibraryTabs = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/movies']}>
        <Layout.Root>
          <Layout.Navbar>
            <div>Navbar</div>
          </Layout.Navbar>
          <Layout.View>
            <Layout.Content>
              <LibraryTabs
                defaultMode="watchlist"
                watchedLabelKey="watcheds"
                tabs={{
                  watchlist: {
                    icon: 'clock',
                    labelKey: 'watchlists',
                    count: 3,
                  },
                  watched: { icon: 'archive', labelKey: 'watcheds', count: 2 },
                }}
              >
                {{
                  watchlist: <div>watchlist-content</div>,
                  watched: <div>watched-content</div>,
                }}
              </LibraryTabs>
            </Layout.Content>
          </Layout.View>
        </Layout.Root>
      </MemoryRouter>
    </Provider>
  );

afterEach(() => {
  cleanup();
});

describe('LibraryTabs', () => {
  it('renders the tabs in the page header', async () => {
    renderLibraryTabs();
    await screen.findByText('watchlist-content');

    const header = document.getElementById('page-header') as HTMLElement;
    const content = document.getElementById('content') as HTMLElement;

    expect(header.querySelectorAll('button')).toHaveLength(2);
    expect(content.querySelectorAll('button')).toHaveLength(0);
    expect(header.textContent).toContain('(3)');
    expect(header.textContent).toContain('(2)');
    expect(content.contains(screen.getByText('watchlist-content'))).toBe(true);
  });

  it('switches modes without leaving the content scroller', async () => {
    renderLibraryTabs();
    await screen.findByText('watchlist-content');

    const header = document.getElementById('page-header') as HTMLElement;
    const watchedButton = header.querySelectorAll('button')[1];

    fireEvent.click(watchedButton);

    await waitFor(() => {
      expect(screen.getByText('watched-content')).toBeInTheDocument();
    });
    expect(
      document
        .getElementById('content')
        ?.contains(screen.getByText('watched-content'))
    ).toBe(true);
    expect(screen.queryByText('watchlist-content')).not.toBeInTheDocument();
  });
});
