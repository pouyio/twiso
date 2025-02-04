import { Translation } from '../models/Translation';

export const getTranslation = (translations: Translation[]) => {
  const { title, overview } = translations.reduce<{
    title?: string;
    overview?: string;
  }>((acc, t) => {
    if (!acc.title && t.title) {
      acc.title = t.title;
    }
    if (!acc.overview && t.overview) {
      acc.overview = t.overview;
    }

    if (t.language == 'es' && t.country == 'es' && t.title) {
      acc.title = t.title;
    }
    if (t.language == 'es' && t.country == 'es' && t.overview) {
      acc.overview = t.overview;
    }
    return acc;
  }, {});
  return { title, overview };
};
