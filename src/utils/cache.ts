import db, {
  DETAIL_MOVIES_TABLE,
  DETAIL_SHOWS_TABLE,
  USER_MOVIES_TABLE,
  USER_SHOWS_TABLE,
} from './db';

export const saveToCache = (
  id: number,
  type: 'show' | 'movie' | 'person',
  language: string,
  url: string
) => {
  localStorage.setItem(`${id}-${type}-${language}`, url);
};

export const getFromCache = (
  id: number,
  type: 'show' | 'movie' | 'person',
  language: string
) => {
  return localStorage.getItem(`${id}-${type}-${language}`);
};

export const removeImgCaches = () => {
  const keys = Object.entries(localStorage);
  keys.forEach((key) => {
    if (
      key[0].includes('-show-') ||
      key[0].includes('-movie-') ||
      key[0].includes('-person-')
    ) {
      localStorage.removeItem(key[0]);
    }
  });
};

export const removeUserCaches = () => {
  db.table(USER_MOVIES_TABLE).clear();
  db.table(USER_SHOWS_TABLE).clear();
};
export const removeDetailsCaches = () => {
  db.table(DETAIL_MOVIES_TABLE).clear();
  db.table(DETAIL_SHOWS_TABLE).clear();
};
