import { useState, useEffect, useCallback } from 'react';
import { getTranslationsApi } from '../utils/api';
import { Movie, Show, Translation } from '../models';
import { useSelector } from 'react-redux';
import { IState } from 'state/state';
import { AuthService } from 'utils/AuthService';

const authService = AuthService.getInstance();

export const useTranslate = (type: 'movie' | 'show', item?: Show | Movie) => {
  const language = useSelector((state: IState) => state.config.language);
  const [translation, setTranslation] = useState<{
    title: string;
    overview: string;
  }>({
    title: '',
    overview: '',
  });
  const isLogged = authService.isLoggedIn();

  const mergeTranslation = useCallback(
    (translation: Translation) => {
      const mergedTranslation = JSON.parse(JSON.stringify(translation));
      if (!translation.overview) {
        mergedTranslation.overview = item!.overview;
      }
      if (!translation.title) {
        mergedTranslation.overview = item!.title;
      }
      return mergedTranslation;
    },
    [item]
  );

  useEffect(() => {
    if (!item) {
      return;
    }
    setTranslation(item);
    if (language === 'en' || !item.available_translations.includes(language)) {
      return;
    }
    getTranslationsApi(item.ids.trakt, type).then(({ data }) => {
      setTranslation(mergeTranslation(data[0]));
    });
  }, [item, isLogged, language, mergeTranslation, type]);

  return translation;
};
