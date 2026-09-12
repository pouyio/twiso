import { describe, expect, it } from 'vitest';
import { Show } from '../models/Show';
import { hasAvailableEpisodes } from './showAvailability';

const today = new Date('2026-09-11T12:00:00Z');

const ids = { slug: 's', tmdb: 1, tvrage: null as any };

const episode = (
  first_aired: string | null,
  number = 1,
  season = 1,
  tmdb = 10
): Show['all_seasons'][number]['episodes'][number] => ({
  ids: { slug: 's', tmdb },
  number,
  number_abs: number,
  season,
  title: '',
  overview: '',
  translations: [],
  completed: false,
  first_aired,
  rating: 0,
  runtime: 0,
  votes: 0,
});

const show = (
  episodes: Show['all_seasons'][number]['episodes'][number][],
  seasonNumber = 1
): Show =>
  ({
    aired_episodes: 0,
    airs: { day: '', time: '', timezone: '' },
    all_seasons: [{ ids, number: seasonNumber, completed: 0, episodes }],
    country: '',
    first_aired: null,
    genres: [],
    homepage: '',
    ids,
    language: '',
    languages: [],
    network: '',
    original_title: '',
    overview: '',
    rating: 0,
    runtime: 0,
    status: 'returning series',
    tagline: '',
    title: '',
    trailer: '',
    votes: 0,
    year: null,
  }) as Show;

describe('hasAvailableEpisodes', () => {
  it('returns false when every aired episode is watched', () => {
    expect(
      hasAvailableEpisodes(show([episode('2026-01-01')]), new Set(['1:1']), today)
    ).toBe(false);
  });

  it('returns true when an aired episode is not watched', () => {
    expect(hasAvailableEpisodes(show([episode('2026-01-01')]), new Set(), today)).toBe(
      true
    );
  });

  it('matches by season and episode number regardless of tmdb id', () => {
    const s = show([episode('2026-01-01', 3, 2, 999)]);
    expect(hasAvailableEpisodes(s, new Set(['2:3']), today)).toBe(false);
    expect(hasAvailableEpisodes(s, new Set(['2:4']), today)).toBe(true);
  });

  it('returns false when only future episodes exist', () => {
    expect(hasAvailableEpisodes(show([episode('2099-01-01')]), new Set(), today)).toBe(
      false
    );
  });

  it('skips season 0 specials', () => {
    expect(
      hasAvailableEpisodes(show([episode('2026-01-01', 1, 0)], 0), new Set(), today)
    ).toBe(false);
  });

  it('treats episodes without a first_aired date as available', () => {
    expect(hasAvailableEpisodes(show([episode(null)]), new Set(), today)).toBe(true);
  });
});