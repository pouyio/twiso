export interface Translation {
  title?: string;
  overview?: string;
  language: string;
  tagline?: string;
  country?: string;
}

export const AVAIABLE_LANGUAGES = ['en', 'es'] as const;
export type Language = (typeof AVAIABLE_LANGUAGES)[number];
