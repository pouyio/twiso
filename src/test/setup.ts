import { vi } from 'vitest';
import '@testing-library/jest-dom';

// PWA mock
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));

// react-image mock
vi.mock('../lib/react-image', () => ({
  Img: () => null,
  useImage: () => ({ isLoading: false }),
}));

// Environment variables
vi.stubGlobal('process', {
  env: {
    VITE_TRAKT_API_KEY: 'test',
    VITE_TMDB_API_KEY: 'test',
    VITE_SUPABASE_DB: 'test',
    VITE_SUPABASE_ANON_KEY: 'test',
  },
});
