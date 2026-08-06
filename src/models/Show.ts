import { Ids } from './Ids';
import { Translation } from './Translation';

export type SeasonEpisode = {
  ids: Ids;
  season: number;
  number: number;
  title: string;
  translations: Translation[];
};

export interface Show {
  aired_episodes: number;
  airs: {
    day: string;
    time: string;
    timezone: string;
  };
  all_seasons: Season[];
  country: string;
  first_aired: string | null;
  genres: number[];
  homepage: string;
  ids: Ids & {
    tvrage: any;
  };
  language: string;
  languages: string[];
  network: string;
  original_title: string;
  overview: string;
  rating: number;
  runtime: number;
  status:
    | 'returning series'
    | 'in production'
    | 'planned'
    | 'canceled'
    | 'ended';
  tagline: string;
  title: string;
  trailer: string;
  votes: number;
  year: number | null;
}

export interface Episode {
  ids: Ids;
  number: number;
  number_abs: number;
  season: number;
  title: string;
  overview: string;
  translations: Translation[];
  completed: boolean;
  first_aired: string | null;
  rating: number;
  runtime: number;
  votes: number;
}

export interface Season {
  episodes: Episode[];
  ids: Ids;
  number: number;
  completed: number;
}
