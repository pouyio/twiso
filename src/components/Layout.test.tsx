import '../index.css';
import '@testing-library/jest-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { page } from 'vitest/browser';
import { afterEach, describe, expect, it } from 'vitest';
import { Layout } from './Layout';

const Fixture = ({ overlay }: { overlay?: React.ReactNode }) => (
  <MemoryRouter>
    <Layout.Root>
      <Layout.SafeAreaTop />
      <Layout.Navbar>
        <div>Navbar</div>
      </Layout.Navbar>
      <Layout.View overlay={overlay}>
        <Layout.Content>
          <Layout.PageHeader>
            <div data-testid="header-content">Page header</div>
          </Layout.PageHeader>
          <div data-testid="tall-content" style={{ height: 2000 }} />
        </Layout.Content>
      </Layout.View>
    </Layout.Root>
  </MemoryRouter>
);

const EmptyHeaderFixture = () => (
  <MemoryRouter>
    <Layout.Root>
      <Layout.SafeAreaTop />
      <Layout.Navbar>
        <div>Navbar</div>
      </Layout.Navbar>
      <Layout.View>
        <Layout.Content>
          <div style={{ height: 2000 }} />
        </Layout.Content>
      </Layout.View>
    </Layout.Root>
  </MemoryRouter>
);

const renderFixture = async (overlay?: React.ReactNode) => {
  render(<Fixture overlay={overlay} />);
  if (!overlay) {
    await screen.findByTestId('header-content');
  }
  return {
    shell: document.getElementById('app-shell') as HTMLElement,
    safeTop: document.getElementById('safe-top') as HTMLElement,
    navbar: document.getElementById('navbar') as HTMLElement,
    view: document.getElementById('view') as HTMLElement,
    header: document.getElementById('page-header') as HTMLElement,
    content: document.getElementById('content') as HTMLElement,
  };
};

afterEach(async () => {
  cleanup();
  document.documentElement.classList.remove('ios-standalone');
  await page.viewport(1280, 800);
});

describe('Layout shell', () => {
  it('renders the shell rows in order', async () => {
    const { shell, safeTop, navbar, view, content } = await renderFixture();

    expect(shell).toBeInTheDocument();
    expect(safeTop).toBeInTheDocument();
    expect(navbar).toBeInTheDocument();
    expect(view).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(view.contains(content)).toBe(true);
  });

  it('portals page headers outside the scrolling content', async () => {
    await renderFixture();
    const headerContent = screen.getByTestId('header-content');
    const header = document.getElementById('page-header') as HTMLElement;
    const content = document.getElementById('content') as HTMLElement;

    expect(header.contains(headerContent)).toBe(true);
    expect(content.contains(headerContent)).toBe(false);
  });

  it('collapses an empty page header', async () => {
    render(<EmptyHeaderFixture />);

    await waitFor(() => {
      const header = document.getElementById('page-header') as HTMLElement;
      expect(header.getBoundingClientRect().height).toBe(0);
    });
  });

  it('uses #content as the only vertical scroller', async () => {
    const { content, view } = await renderFixture();

    await waitFor(() => {
      expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
    });

    content.scrollTop = 300;
    expect(content.scrollTop).toBeGreaterThan(0);

    // The viewport itself must not scroll.
    expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(
      document.documentElement.clientHeight + 1
    );
    expect(view.getBoundingClientRect().height).toBeLessThanOrEqual(
      window.innerHeight + 1
    );
  });

  it('keeps the page header in place while the content scrolls', async () => {
    const { header, content } = await renderFixture();
    const before = header.getBoundingClientRect().top;

    content.scrollTop = 500;

    await waitFor(() => {
      expect(header.getBoundingClientRect().top).toBe(before);
    });
  });

  it('places the navbar at the bottom on mobile', async () => {
    await page.viewport(390, 844);
    const { navbar, view } = await renderFixture();

    await waitFor(() => {
      expect(navbar.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        view.getBoundingClientRect().bottom - 1
      );
      expect(navbar.getBoundingClientRect().height).toBeGreaterThan(0);
    });
  });

  it('bleeds the mobile navbar to the bottom edge', async () => {
    await page.viewport(390, 844);
    const { navbar, shell } = await renderFixture();

    await waitFor(() => {
      expect(
        Math.abs(
          navbar.getBoundingClientRect().bottom -
            shell.getBoundingClientRect().bottom
        )
      ).toBeLessThanOrEqual(1);
    });
  });

  it('lets the desktop view reach the bottom edge', async () => {
    await page.viewport(1280, 800);
    const { shell, view } = await renderFixture();

    await waitFor(() => {
      expect(
        Math.abs(
          view.getBoundingClientRect().bottom -
            shell.getBoundingClientRect().bottom
        )
      ).toBeLessThanOrEqual(1);
    });
  });

  it('gives standalone iOS a sticky strip for status-bar tinting', async () => {
    document.documentElement.classList.add('ios-standalone');
    const { safeTop } = await renderFixture();

    const styles = getComputedStyle(safeTop);
    expect(styles.position).toBe('sticky');
    expect(safeTop.getBoundingClientRect().height).toBeGreaterThanOrEqual(11);
  });

  it('keeps the mobile layout in phone landscape', async () => {
    await page.viewport(844, 390);
    const { navbar, view, shell } = await renderFixture();

    await waitFor(() => {
      expect(navbar.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        view.getBoundingClientRect().bottom - 1
      );
      expect(
        Math.abs(shell.getBoundingClientRect().height - window.innerHeight)
      ).toBeLessThanOrEqual(1);
    });
  });

  it('keeps the iPad portrait layout mobile', async () => {
    await page.viewport(768, 1024);
    const { navbar, view } = await renderFixture();

    await waitFor(() => {
      expect(navbar.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        view.getBoundingClientRect().bottom - 1
      );
    });
  });

  it('places the navbar at the top on desktop', async () => {
    await page.viewport(1280, 800);
    const { navbar, view, safeTop } = await renderFixture();

    await waitFor(() => {
      expect(navbar.getBoundingClientRect().top).toBeLessThanOrEqual(
        view.getBoundingClientRect().top + 1
      );
      expect(safeTop.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        navbar.getBoundingClientRect().top + 1
      );
    });
  });

  it('uses the desktop layout at iPad landscape width', async () => {
    await page.viewport(1024, 768);
    const { navbar, view } = await renderFixture();

    await waitFor(() => {
      expect(navbar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        view.getBoundingClientRect().top + 1
      );
    });
  });

  it('keeps the shell the same height as the viewport', async () => {
    await page.viewport(390, 844);
    const { shell } = await renderFixture();

    await waitFor(() => {
      expect(
        Math.abs(shell.getBoundingClientRect().height - window.innerHeight)
      ).toBeLessThanOrEqual(1);
    });
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1
    );
  });

  it('anchors an overlay to the view, not the navbar', async () => {
    const { view, navbar } = await renderFixture(
      <Layout.Overlay>
        <div data-testid="overlay-content">Overlay</div>
      </Layout.Overlay>
    );
    const overlay = screen
      .getByTestId('overlay-content')
      .closest('#overlay') as HTMLElement;

    expect(view.contains(overlay)).toBe(true);
    expect(navbar.contains(overlay)).toBe(false);

    await waitFor(() => {
      expect(overlay.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        view.getBoundingClientRect().top - 1
      );
      expect(overlay.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        view.getBoundingClientRect().bottom + 1
      );
    });
  });
});
