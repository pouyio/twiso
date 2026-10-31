import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Layout } from '../components/Layout';
import { usePageBackground } from './usePageBackground';

const Page = ({ color }: { color?: string }) => {
  usePageBackground(color);
  return null;
};

const getShell = () => document.getElementById('app-shell') as HTMLElement;

describe('usePageBackground', () => {
  it('sets the page background on the app shell', async () => {
    render(
      <Layout.Root>
        <Page color="var(--color-green-400)" />
      </Layout.Root>
    );

    await waitFor(() => {
      expect(getShell().style.getPropertyValue('--page-bg')).toBe(
        'var(--color-green-400)'
      );
    });
  });

  it('updates when the background changes', async () => {
    const { rerender } = render(
      <Layout.Root>
        <Page color="var(--color-green-400)" />
      </Layout.Root>
    );

    rerender(
      <Layout.Root>
        <Page color="var(--color-blue-400)" />
      </Layout.Root>
    );

    await waitFor(() => {
      expect(getShell().style.getPropertyValue('--page-bg')).toBe(
        'var(--color-blue-400)'
      );
    });
  });

  it('resets the background on unmount for the safe-area strip', async () => {
    const { rerender } = render(
      <Layout.Root>
        <Page color="var(--color-green-400)" />
      </Layout.Root>
    );

    await waitFor(() => {
      expect(getShell().style.getPropertyValue('--page-bg')).toBe(
        'var(--color-green-400)'
      );
    });

    rerender(
      <Layout.Root>
        <div>Another page</div>
      </Layout.Root>
    );

    expect(getShell().style.getPropertyValue('--page-bg')).toBe(
      'var(--color-white)'
    );
  });

  it('does not let an old page reset a new page background', async () => {
    const { rerender } = render(
      <Layout.Root>
        <Page color="var(--color-green-400)" />
      </Layout.Root>
    );

    await waitFor(() => {
      expect(getShell().style.getPropertyValue('--page-bg')).toBe(
        'var(--color-green-400)'
      );
    });

    rerender(
      <Layout.Root>
        <Page color="var(--color-blue-400)" />
      </Layout.Root>
    );

    await waitFor(() => {
      expect(getShell().style.getPropertyValue('--page-bg')).toBe(
        'var(--color-blue-400)'
      );
    });
  });
});
