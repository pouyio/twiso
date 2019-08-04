import React, { useEffect, useState, useContext } from 'react';
import WatchButton from './WatchButton';
import { getMovie } from '../utils/api';
import Image from './Image';
import useTranslate from '../utils/useTranslate';
import Emoji from './Emoji';
import UserContext from '../utils/UserContext';
import Related from './Related';
import getGenre from '../utils/getGenre';

export default function MovieDetail({ location: { state }, match: { params: { id } } }) {

    const [item, setItem] = useState(false);
    const { userInfo: {
        movies: { watched, watchlist } },
        language } = useContext(UserContext);
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

    const isWatched = () => {
        if (!item) {
            return false;
        }
        return watched.some(w => w.movie.ids.trakt === item.movie.ids.trakt);
    }

    const isWatchlist = () => {
        if (!item) {
            return false;
        }
        return watchlist.some(w => w.movie.ids.trakt === item.movie.ids.trakt);
    }

    const getBgClassName = () => {
        if (isWatched()) {
            return 'bg-green-400';
        }
        if (isWatchlist()) {
            return 'bg-blue-400';
        }
        return 'bg-gray-300';
    }

    return (
        item ? (<div className={getBgClassName()}>
            <Image item={item} className="p-10 sticky top-0 z-0" style={{ minHeight: '15em' }} />
            <article className="relative p-4 bg-white z-10 rounded-t-lg" style={{ 'transform': 'translate3d(0,0,0)' }}>
                <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
                <h1 className="text-4xl leading-none">{title}</h1>
                <div className="flex mb-4 justify-between">
                    <h2 className="text-2xl text-gray-600 ">{new Date(item.movie.released).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                    <a href={item.movie.trailer} target="_blank" rel="noopener noreferrer"><img src="/youtube.png" alt="youtube" /></a>
                </div>
                <WatchButton item={item} />

                <div className="my-4">
                    <p>Resumen:</p>
                    <p className="leading-tight font-light">{overview || 'Sin descripción'}</p>
                </div>

                <div className="my-4">
                    <p>Géneros:</p>
                    <ul className="flex overflow-x-auto my-2 -mr-4">
                        {item.movie.genres.map(g => (
                            <li className="bg-gray-200 font-light px-3 py-2 rounded-full mx-1 whitespace-pre"><Emoji emoji={getGenre(g).emoji} /> {g}</li>
                        ))}
                    </ul>
                </div>

                <div className="my-4">
                    <p>Relacionados:</p>
                    <Related itemId={item.movie.ids.trakt} />
                </div>

            </article>
        </div>)
            : <Emoji emoji="⏳" rotating="true" />
    );
}