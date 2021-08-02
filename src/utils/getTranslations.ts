import { Translation } from 'models';

export const getTranslation = (translations: Translation[]) => {
  const { title, overview } = translations.reduce((acc, t) => {
    if (!acc.title && t.title) {
      acc.title = t.title;
    }
    if (!acc.overview && t.overview) {
      acc.overview = t.overview;
    }
    return acc;
  }, {} as { title?: string; overview?: string });
  return { title, overview };
};
