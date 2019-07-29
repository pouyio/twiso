import { useState, useEffect, useContext } from 'react';
import { getMovieTranslations } from './api';
import AuthContext from './AuthContext';
import UserContext from './UserContext';

export default function useTranslate(item) {

    const { session } = useContext(AuthContext);
    const { language } = useContext(UserContext);
    const [translation, setTranslation] = useState(item.movie || {});

    useEffect(() => {
        if (!item) {
            return;
        }
        setTranslation(item.movie);
        if (language === 'en' || !item.movie.available_translations.includes(language)) {
            return;
        }
        getMovieTranslations(session, item.movie.ids.trakt).then(({ data }) => {
            setTranslation(data[0]);
        });
    }, [item, session, language]);

    return translation;
}