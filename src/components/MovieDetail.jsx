import React, { useEffect, useState } from 'react';
import WatchButton from './WatchButton';
import { getMovie } from '../utils/api';
import Image from './Image';
import useTranslate from '../utils/useTranslate';

export default function MovieDetail({ location: { state }, match: { params: { id } } }) {

    const [item, setItem] = useState(false);
    const { title, overview } = useTranslate(item);

    useEffect(() => {
        if (!state) {
            getMovie(id).then(({ data }) => {
                const item = data[0];
                setItem(item);
            });
            return;
        }
        setItem(state.item);
    }, [state, id]);

    return (
        item ? (<div>
            <h1>{title}</h1>
            <WatchButton item={item} />
            <p><small> <span role="img" aria-label="emoji">📅</span> {item.movie.year}</small></p>
            <a href={item.movie.trailer} target="_blank" rel="noopener noreferrer"><span role="img" aria-label="emoji">▶️</span> Trailer</a>
            <p>{overview || 'Sin descripción'}</p>
            <Image item={item} />
        </div>)
            : <span role="img" aria-label="emoji">⏳</span>
    );
}