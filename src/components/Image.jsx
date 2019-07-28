import React, { useEffect, useContext, useState } from 'react';
import { getImgs } from '../utils/api';
import UserContext from '../utils/UserContext';
import { useInView } from 'react-hook-inview';

export default function Image({ item }) {

    const [imgUrl, setImgUrl] = useState('');
    const { config, language } = useContext(UserContext);
    const [ref, inView] = useInView({ unobserveOnEnter: true });

    const placeholder = (text) => `https://via.placeholder.com/450x680?text=${text}`;

    useEffect(() => {
        if (!config) {
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
                `${config.images.secure_base_url}${posterSize}/${poster.file_path}`
                : placeholder('Film does not have image');
            setImgUrl(url);
        }).catch(() => {
            setImgUrl(placeholder('Film not found in TMDB'));
        });
    }, [config, item.movie.ids.tmdb, language])

    return (
        <div ref={ref} style={{ minHeight: '10em'}}>
            {inView && <img className="rounded-lg" src={imgUrl} alt="poster" />}
        </div>
    );
}