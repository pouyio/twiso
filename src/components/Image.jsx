import React, { useEffect, useContext, useState } from 'react';
import { getImgs } from '../utils/api';
import UserContext from '../utils/UserContext';
import { useInView } from 'react-hook-inview';

export default function Image({ item, className = '', style, ...props }) {

    const [imgUrl, setImgUrl] = useState('');
    const { config, language, isMovieWatched, isMovieWatchlist } = useContext(UserContext);
    const [ref, inView] = useInView({ unobserveOnEnter: true });

    const placeholder = (text) => `https://via.placeholder.com/320x480?text=${text}`;

    useEffect(() => {
        if (!config || !inView) {
            return;
        }

        const findFirstValid = (posters) => {
            const p = posters.find(p => p.iso_639_1 === language);
            return p || posters[0];
        }

        getImgs(item[item.type].ids.tmdb, item.type).then(({ data }) => {
            const posterSize = config.images.profile_sizes[1];
            const poster = findFirstValid(data.posters);
            const url = poster ?
                `${config.images.secure_base_url}${posterSize}${poster.file_path}`
                : placeholder(`"${item[item.type].title}" does not have image`);
            setImgUrl(url);
        }).catch(() => {
            setImgUrl(placeholder(`"${item[item.type].title}" not found in TMDB`));
        });
    }, [config, item, language, inView]);

    const getBorderClass = () => {
        if (isMovieWatched(item[item.type].ids.trakt)) {
            return 'border-2 border-green-400';
        }
        if (isMovieWatchlist(item[item.type].ids.trakt)) {
            return 'border-2 border-blue-400';
        }
        return '';
    }

    return (
        <div ref={ref} style={style} {...props} className={className + ' ' + (!inView ? 'bg-gray-300 flex justify-center items-center rounded-lg' : '')}>
            {!inView && <h1 className="justify-center items-center">{item[item.type].title}</h1>}
            {inView && <img className={'rounded-lg m-auto md:max-w-md ' + getBorderClass()} src={imgUrl} alt={item[item.type].title} />}
        </div>
    );
}