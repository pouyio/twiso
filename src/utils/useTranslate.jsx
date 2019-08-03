import { useState, useEffect, useContext, useCallback } from 'react';
import { getMovieTranslations } from './api';
import AuthContext from './AuthContext';
import UserContext from './UserContext';

export default function useTranslate(item) {

    const { session } = useContext(AuthContext);
    const { language } = useContext(UserContext);
    const [translation, setTranslation] = useState(item.movie || {});

    const mergeTranslation = useCallback((translation) => {
        const mergedTranslation = JSON.parse(JSON.stringify(translation));
        if(!translation.overview) {
            mergedTranslation.overview = item.movie.overview;
        }
        if(!translation.title) {
            mergedTranslation.overview = item.movie.title;
        }
        return mergedTranslation;
    }, [item.movie]);

    useEffect(() => {
        if (!item) {
            return;
        }
        setTranslation(item.movie);
        if (language === 'en' || !item.movie.available_translations.includes(language)) {
            return;
        }
        getMovieTranslations(session, item.movie.ids.trakt).then(({ data }) => {
            setTranslation(mergeTranslation(data[0]));
        });
    }, [item, session, language, mergeTranslation]);

    return translation;
}