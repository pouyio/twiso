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
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Layout } from '../../components/Layout';
import { store } from '../../state/store';
import Search from './Search';

const apiMocks = vi.hoisted(() => ({
  searchApi: vi.fn(async () => []),
  getPopularApi: vi.fn(async () => []),
}));

vi.mock('../../utils/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../utils/api')>();
  return {
    ...actual,
    searchApi: apiMocks.searchApi,
    getPopularApi: apiMocks.getPopularApi,
  };
});

const renderSearch = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/search']}>
        <Layout.Root>
          <Layout.Navbar>
            <div>Navbar</div>
          </Layout.Navbar>
          <Layout.View>
            <Layout.Content>
              <Search />
            </Layout.Content>
          </Layout.View>
        </Layout.Root>
      </MemoryRouter>
    </Provider>
  );

afterEach(() => {
  cleanup();
  apiMocks.searchApi.mockClear();
  apiMocks.getPopularApi.mockClear();
});

describe('Search page', () => {
  it('renders the search controls in the page header', async () => {
    renderSearch();

    await waitFor(() => {
      expect(
        document.getElementById('page-header')?.querySelector('input')
      ).not.toBeNull();
    });

    const header = document.getElementById('page-header') as HTMLElement;
    const content = document.getElementById('content') as HTMLElement;
    const input = screen.getByRole('textbox');

    expect(header.contains(input)).toBe(true);
    expect(content.contains(input)).toBe(false);
    expect(input).toHaveFocus();
    expect(content.querySelectorAll('ul').length).toBeGreaterThanOrEqual(2);
  });

  it('runs a remote search after typing', async () => {
    renderSearch();

    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'alien' } });

    await waitFor(
      () => {
        expect(apiMocks.searchApi).toHaveBeenCalledWith(
          'alien',
          'movie,show,person'
        );
      },
      { timeout: 3000 }
    );
  });
});
