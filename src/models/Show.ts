import { Ids } from './Ids';
import { Translation } from './Translation';

export type SeasonEpisode = {
  ids: Ids;
  season: number;
  number: number;
  title: string;
  translations: Translation[];
};

export type ShowSeason = {
  ids: Ids;
  number: number;
  episodes: SeasonEpisode[];
};

export interface Show {
  aired_episodes: number;
  airs: {
    day: string;
    time: string;
    timezone: string;
  };
  all_seasons: ShowSeason[];
  available_translations: string[];
  certification: string;
  comment_count: number;
  country: string;
  first_aired: string;
  genres: string[];
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
  updated_at: string;
  votes: number;
  year: number;
}

export interface Episode {
  ids: Ids;
  number: number;
  number_abs: 14;
  season: number;
  title: string;
  overview: string;
  available_translations: string[];
  translations: {
    title: string;
    overview: string;
    tagline: string;
    language: string;
  }[];
  completed: boolean;
  comment_count: number;
  first_aired: string;
  rating: number;
  runtime: number;
  updated_at: string;
  votes: string;
}

export interface Season {
  episodes: Episode[];
  ids: Ids;
  number: number;
  completed: number;
}
