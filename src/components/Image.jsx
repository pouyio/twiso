import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../utils/UserContext';
import { useInView } from 'react-hook-inview';
import Emoji from '../components/Emoji';
import getImgUrl from '../utils/extractImg';

export default function Image({ item, className = '', type = '', style, ...props }) {

    const [imgUrl, setImgUrl] = useState('');
    const [message, setMessage] = useState('');
    const { config, language, isWatched, isWatchlist } = useContext(UserContext);
    const [ref, inView] = useInView({ unobserveOnEnter: true });

    useEffect(() => {
        if (!config || !inView) {
            return;
        }

        getImgUrl(item[item.type].ids.tmdb, item.type, config, language)
            .then(url => setImgUrl(url))
            .catch(({ message }) => setMessage(message));

    }, [config, item, language, inView]);

    const getBorderClass = () => {
        if (isWatched(item[item.type].ids.trakt, type)) {
            return 'border-2 border-green-400';
        }
        if (isWatchlist(item[item.type].ids.trakt, type)) {
            return 'border-2 border-blue-400';
        }
        return '';
    }

    return (
        <div ref={ref} style={style} {...props} className={className + ' h-full bg-gray-300 flex justify-center items-center rounded-lg overflow-hidden ' + getBorderClass()}>
            {(!inView || !imgUrl) && <h1 className="justify-center items-center p-2">
                {item[item.type].title}
                <br />
                {message || <Emoji className="ml-3" emoji="⏳" rotating={true} />}
            </h1>}
            {inView && imgUrl && <img className={'m-auto md:max-w-md h-full'} src={imgUrl} alt={item[item.type].title} />}
        </div>
    );
}