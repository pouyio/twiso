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

        getImgs(item.movie.ids.tmdb).then(({ data }) => {
            const posterSize = config.images.profile_sizes[1];
            const poster = findFirstValid(data.posters);
            const url = poster ?
                `${config.images.secure_base_url}${posterSize}${poster.file_path}`
                : placeholder(`"${item.movie.title}" does not have image`);
            setImgUrl(url);
        }).catch(() => {
            setImgUrl(placeholder(`"${item.movie.title}" not found in TMDB`));
        });
    }, [config, item.movie.ids.tmdb, language, inView, item.movie.title]);

    const getBorderClass = () => {
        if (isMovieWatched(item.movie.ids.trakt)) {
            return 'border-2 border-green-400';
        }
        if (isMovieWatchlist(item.movie.ids.trakt)) {
            return 'border-2 border-blue-400';
        }
        return '';
    }

    return (
        <div ref={ref} style={style} {...props} className={className + ' ' + (!inView ? 'bg-gray-300 flex justify-center items-center rounded-lg' : '')}>
            {!inView && <h1 className="justify-center items-center">{item.movie.title}</h1>}
            {inView && <img className={'rounded-lg m-auto md:max-w-md ' + getBorderClass()} src={imgUrl} alt={item.movie.title} />}
        </div>
    );
}