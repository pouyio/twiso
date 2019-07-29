import React, { useEffect, useState, useContext } from 'react';
import WatchButton from './WatchButton';
import { getMovie } from '../utils/api';
import Image from './Image';
import useTranslate from '../utils/useTranslate';
import Emoji from './Emoji';
import UserContext from '../utils/UserContext';

export default function MovieDetail({ location: { state }, match: { params: { id } } }) {

    const [item, setItem] = useState(false);
    const { language } = useContext(UserContext);
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
        item ? (<div className="bg-gray-400">
            <Image item={item} className="p-10 sticky top-0 z-0" />
            <article className="relative p-4 bg-white z-10 rounded-t-lg" style={{ 'transform': 'translate3d(0,0,0)' }}>
                <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
                <h1 className="text-4xl leading-none">{title}</h1>
                <div className="flex mb-4 justify-between">
                    <h2 className="text-2xl text-gray-600 ">{new Date(item.movie.released).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                    <a href={item.movie.trailer} target="_blank" rel="noopener noreferrer"><img src="/youtube.png" alt="youtube"/></a>
                </div>
                <WatchButton item={item} />
                <p>{overview || 'Sin descripción'}</p>
            </article>
        </div>)
            : <Emoji emoji={'⏳'} />
    );
}