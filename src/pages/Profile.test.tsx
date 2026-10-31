import '@testing-library/jest-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { Layout } from '../components/Layout';
import { store } from '../state/store';
import Profile from './Profile';

const renderProfile = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/profile']}>
        <Layout.Root>
          <Layout.Navbar>
            <div>Navbar</div>
          </Layout.Navbar>
          <Layout.View>
            <Layout.Content>
              <Profile />
            </Layout.Content>
          </Layout.View>
        </Layout.Root>
      </MemoryRouter>
    </Provider>
  );

afterEach(() => {
  cleanup();
});

describe('Profile page', () => {
  it('keeps theme and language selectors in the page header', async () => {
    renderProfile();

    await waitFor(() => {
      expect(document.getElementById('page-header')).toBeInTheDocument();
    });

    const header = document.getElementById('page-header') as HTMLElement;
    const content = document.getElementById('content') as HTMLElement;

    expect(header.querySelectorAll('select')).toHaveLength(2);
    expect(content.querySelectorAll('select')).toHaveLength(0);
    expect(content.textContent).toContain('Version:');
  });

  it('renders the logged-out login action in the scrolling content', async () => {
    renderProfile();

    const login = await screen.findByText('Login');

    expect(document.getElementById('content')?.contains(login)).toBe(true);
    expect(document.getElementById('page-header')?.contains(login)).toBe(false);
  });
});
