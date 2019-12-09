import db from './db';

export const saveToCache = (
  id: number,
  type: 'show' | 'movie' | 'person',
  language: string,
  url: string,
) => {
  localStorage.setItem(`${id}-${type}-${language}`, url);
};

export const getFromCache = (
  id: number,
  type: 'show' | 'movie' | 'person',
  language: string,
) => {
  return localStorage.getItem(`${id}-${type}-${language}`);
};

export const removeImgCaches = () => {
  const keys = Object.entries(localStorage);
  keys.forEach(key => {
    if (
      key[0].includes('-show-') ||
      key[0].includes('-movie-') ||
      key[0].includes('-person-')
    ) {
      localStorage.removeItem(key[0]);
    }
  });
};

export const removeCaches = () => {
  db.table('movies').clear();
  db.table('shows').clear();
};
