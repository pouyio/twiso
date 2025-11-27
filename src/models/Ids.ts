export interface Ids {
  trakt: number;
  slug: string;
  imdb: string;
  tmdb: number;
  traktslug: string;
}

export type ImageIds = { imdb: string } & Partial<Ids>;
