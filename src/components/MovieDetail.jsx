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
    const { language,
        isMovieWatched,
        isMovieWatchlist } = useContext(UserContext);
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
        window.scrollTo(0, 0);
    }, [state, id]);

    const getBgClassName = () => {
        if (!item) {
            return;
        }
        if (isMovieWatched(item.movie.ids.trakt)) {
            return 'bg-green-400';
        }
        if (isMovieWatchlist(item.movie.ids.trakt)) {
            return 'bg-blue-400';
        }
        return 'bg-gray-300';
    }

    return (
        item ? (<div className={getBgClassName()}>
            <div className="p-10 sticky top-0 z-0" style={{ minHeight: '15em' }}>
                <Image item={item} />
                <a className="absolute" style={{ right: '4em', bottom: '4em' }} href={item.movie.trailer} target="_blank" rel="noopener noreferrer">
                    <Emoji emoji="▶️" className="text-4xl" />
                </a>
            </div>
            <article className="relative p-4 bg-white z-10 rounded-t-lg" style={{ 'transform': 'translate3d(0,0,0)' }}>
                <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
                <h1 className="text-4xl leading-none text-center mb-2">{title}</h1>
                <div className="flex mb-4 justify-between items-center text-gray-600 text-2xl ">
                    <h2>{new Date(item.movie.released).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                    <h3 className="font-light">{item.movie.runtime} mins</h3>
                </div>
                <WatchButton item={item} />

                <div className="my-4">
                    <p>Resumen:</p>
                    <p className="leading-tight font-light">{overview || 'Sin descripción'}</p>
                </div>

                <div className="my-4">
                    <p>Géneros:</p>
                    <ul className="flex overflow-x-auto my-2 -mr-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {item.movie.genres.map(g => (
                            <li key={g} className="bg-gray-200 font-light px-3 py-2 rounded-full mx-1 whitespace-pre"><Emoji emoji={getGenre(g).emoji} /> {getGenre(g).name}</li>
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