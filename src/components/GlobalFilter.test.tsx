import '../index.css';
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
import { page } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { store } from '../state/store';
import { setGlobalSearch } from '../state/slices/root';
import { Layout } from './Layout';
import { GlobalFilter } from './GlobalFilter';

const { results } = vi.hoisted(() => ({
  results: Array.from({ length: 10 }, (_, i) => ({
    ids: { tmdb: i + 1 },
    title: `Result ${i + 1}`,
    genres: [],
  })),
}));

vi.mock('../hooks/useFilter', () => ({
  useFilter: () => ({ filter: () => results, filterBy: () => [] }),
}));

vi.mock('./Image', () => ({
  default: () => <div style={{ minHeight: '13.5em' }} />,
}));

const renderOverlay = () => {
  store.dispatch(setGlobalSearch(true));
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Layout.Root>
          <Layout.SafeAreaTop />
          <Layout.Navbar>
            <div>Navbar</div>
          </Layout.Navbar>
          <Layout.View
            overlay={
              <Layout.Overlay>
                <GlobalFilter />
              </Layout.Overlay>
            }
          >
            <Layout.Content>
              <div style={{ height: 2000 }} />
            </Layout.Content>
          </Layout.View>
        </Layout.Root>
      </MemoryRouter>
    </Provider>
  );
};

const getGeometry = () => {
  const overlay = document.getElementById('overlay') as HTMLElement;
  const view = document.getElementById('view') as HTMLElement;
  const navbar = document.getElementById('navbar') as HTMLElement;

  return { overlay, view, navbar };
};

afterEach(async () => {
  cleanup();
  store.dispatch(setGlobalSearch(false));
  await page.viewport(1280, 800);
});

describe('GlobalFilter overlay', () => {
  it('anchors to the view, grows with its content, and leaves the navbar visible', async () => {
    await page.viewport(390, 844);
    renderOverlay();
    const { overlay, view, navbar } = getGeometry();

    expect(overlay).toBeInTheDocument();
    expect(view.contains(overlay)).toBe(true);
    expect(navbar.contains(overlay)).toBe(false);

    await waitFor(() => {
      const overlayRect = overlay.getBoundingClientRect();
      const viewRect = view.getBoundingClientRect();

      expect(Math.abs(overlayRect.top - viewRect.top)).toBeLessThanOrEqual(1);
      expect(Math.abs(overlayRect.width - viewRect.width)).toBeLessThanOrEqual(
        1
      );
      // Empty search: the overlay is only as tall as the input row.
      expect(overlayRect.height).toBeGreaterThan(0);
      expect(overlayRect.height).toBeLessThan(viewRect.height);
      expect(overlayRect.bottom).toBeLessThanOrEqual(viewRect.bottom + 1);
    });
  });

  it('clamps a long result list to the view and scrolls the list', async () => {
    await page.viewport(390, 844);
    renderOverlay();
    const input = screen.getByPlaceholderText(
      '🔍 Escribe un título de tu colección'
    );

    fireEvent.change(input, { target: { value: 'result' } });

    await waitFor(() => {
      expect(screen.getAllByRole('link')).toHaveLength(results.length);
    });

    const { overlay, view, navbar } = getGeometry();
    const list = overlay.querySelector('ul') as HTMLElement;

    await waitFor(() => {
      const overlayRect = overlay.getBoundingClientRect();
      const viewRect = view.getBoundingClientRect();

      expect(overlayRect.height).toBeLessThanOrEqual(viewRect.height + 1);
      expect(overlayRect.bottom).toBeLessThanOrEqual(viewRect.bottom + 1);
      expect(navbar.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        overlayRect.bottom - 1
      );
      // The list itself scrolls instead of being clipped by the view.
      expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    });
  });

  it('closes through the global-search action', () => {
    renderOverlay();

    expect(store.getState().root.globalSearch).toBe(true);
    fireEvent.click(screen.getByRole('button'));

    expect(store.getState().root.globalSearch).toBe(false);
  });
});
