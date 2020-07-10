import { useState, useEffect, useContext, useCallback } from 'react';
import { getTranslationsApi } from '../utils/api';
import { AuthContext } from '../contexts';
import { Movie, Show, Translation } from '../models';
import { useSelector } from 'react-redux';
import { IState } from 'state/state';

export const useTranslate = (type: 'movie' | 'show', item?: Show | Movie) => {
  const { session } = useContext(AuthContext);
  const language = useSelector((state: IState) => state.language);
  const [translation, setTranslation] = useState<{
    title: string;
    overview: string;
  }>({
    title: '',
    overview: '',
  });

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
  }, [item, session, language, mergeTranslation, type]);

  return translation;
};
