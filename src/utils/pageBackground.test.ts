import { describe, expect, it } from 'vitest';
import { getMovieBackground, getShowBackground } from './pageBackground';

describe('getMovieBackground', () => {
  it('uses green for watched movies', () => {
    expect(getMovieBackground('watched')).toBe('var(--color-green-400)');
  });

  it('uses blue for watchlist movies', () => {
    expect(getMovieBackground('watchlist')).toBe('var(--color-blue-400)');
  });

  it('uses gray when the movie is not in the library', () => {
    expect(getMovieBackground()).toBe('var(--color-gray-300)');
  });
});

describe('getShowBackground', () => {
  it('uses dark green for hidden shows', () => {
    expect(getShowBackground({ status: 'watched', hidden: true })).toBe(
      'var(--color-green-800)'
    );
  });

  it('uses green for watched shows', () => {
    expect(getShowBackground({ status: 'watched', hidden: false })).toBe(
      'var(--color-green-400)'
    );
  });

  it('uses blue for watchlist shows', () => {
    expect(getShowBackground({ status: 'watchlist', hidden: false })).toBe(
      'var(--color-blue-400)'
    );
  });

  it('uses gray when the show is not in the library', () => {
    expect(getShowBackground()).toBe('var(--color-gray-300)');
    expect(getShowBackground(null)).toBe('var(--color-gray-300)');
  });
});
