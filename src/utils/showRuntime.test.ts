import { describe, expect, it } from 'vitest';
import { getMedianRuntime } from './showRuntime';

describe('getMedianRuntime', () => {
  it('returns median for an odd number of runtimes', () => {
    const seasons = [{ number: 1, episodes: [{ runtime: 50 }, { runtime: 52 }, { runtime: 60 }] }];
    expect(getMedianRuntime(seasons)).toBe(52);
  });

  it('returns the average middle for an even number of runtimes', () => {
    const seasons = [{ number: 1, episodes: [{ runtime: 50 }, { runtime: 52 }, { runtime: 60 }, { runtime: 54 }] }];
    expect(getMedianRuntime(seasons)).toBe(53);
  });

  it('aggregates across seasons and skips season 0 and zero runtimes', () => {
    const seasons = [
      { number: 0, episodes: [{ runtime: 100 }] },
      { number: 1, episodes: [{ runtime: 0 }, { runtime: 40 }, { runtime: 60 }] },
    ];
    expect(getMedianRuntime(seasons)).toBe(50);
  });

  it('returns null when there are no valid runtimes', () => {
    expect(getMedianRuntime([])).toBeNull();
    expect(getMedianRuntime([{ number: 1, episodes: [{ runtime: 0 }] }])).toBeNull();
  });
});
