import { useState, useEffect, useContext, useCallback } from 'react';
import { getTranslationsApi } from './api';
import AuthContext from './AuthContext';
import UserContext from './UserContext';

export default function useTranslate(item) {

    const { session } = useContext(AuthContext);
    const { language } = useContext(UserContext);
    const [translation, setTranslation] = useState(item[item.type] || {});

    const mergeTranslation = useCallback((translation) => {
        const mergedTranslation = JSON.parse(JSON.stringify(translation));
        if(!translation.overview) {
            mergedTranslation.overview = item[item.type].overview;
        }
        if(!translation.title) {
            mergedTranslation.overview = item[item.type].title;
        }
        return mergedTranslation;
    }, [item]);

    useEffect(() => {
        if (!item) {
            return;
        }
        setTranslation(item[item.type]);
        if (language === 'en' || !item[item.type].available_translations.includes(language)) {
            return;
        }
        getTranslationsApi(item[item.type].ids.trakt, item.type).then(({ data }) => {
            setTranslation(mergeTranslation(data[0]));
        });
    }, [item, session, language, mergeTranslation]);

    return translation;
}