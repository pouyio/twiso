import React, { useEffect, useState } from 'react';
import { getShow } from '../utils/api';
import Image from './Image';
import useTranslate from '../utils/useTranslate';
import Emoji from './Emoji';
import Related from './Related';
import SeasonsContainer from './Seasons/SeasonsContainer';
import getGenre from '../utils/getGenre';

const status = {
    'returning series': 'en antena',
    'in production': 'en producción',
    'planned': 'planeada',
    'canceled': 'cancelada',
    'ended': 'terminada'
}

export default function ShowDetail({ location: { state }, match: { params: { id } } }) {

    const [item, setItem] = useState(false);
    const { title, overview } = useTranslate(item);

    useEffect(() => {
        if (!state) {
            getShow(id).then(({ data }) => {
                const item = data[0];
                setItem(item);
            });
            return;
        }
        setItem(state.item);
        window.scrollTo(0, 0);
    }, [state, id]);

    return (
        item ? (<div className="bg-gray-300">
            <div className="p-10 sticky top-0 z-0" style={{ minHeight: '15em' }}>
                <Image item={item} type="show" />
                {item.show.trailer && <a className="absolute" style={{ right: '4em', bottom: '4em' }} href={item.show.trailer} target="_blank" rel="noopener noreferrer">
                    <Emoji emoji="▶️" className="text-4xl" />
                </a>}
            </div>
            <article className="relative p-4 bg-white z-10 rounded-t-lg" style={{ 'transform': 'translate3d(0,0,0)' }}>
                <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
                <h1 className="text-4xl leading-none text-center mb-4">{title}</h1>
                <div className="flex mb-4 justify-between items-center text-gray-600">
                    <h2 className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200 capitalize">{status[item.show.status]}</h2>
                    <h2>{item.show.runtime} mins</h2>
                </div>

                <div className="my-4">
                    <SeasonsContainer show={item.show} showId={id} />
                </div>

                <div className="my-4">
                    <p>Resumen:</p>
                    <p className="leading-tight font-light">{overview || 'Sin descripción'}</p>
                </div>

                <div className="my-4">
                    <p>Géneros:</p>
                    <ul className="flex overflow-x-auto my-2 -mr-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {(item.show.genres || []).map(g => (
                            <li key={g} className="bg-gray-200 font-light px-3 py-2 rounded-full mx-1 whitespace-pre"><Emoji emoji={getGenre(g).emoji} /> {getGenre(g).name}</li>
                        ))}
                    </ul>
                </div>

                <div className="my-4">
                    <p>Relacionados:</p>
                    <Related itemId={item.show.ids.trakt} type="show" />
                </div>

            </article>
        </div>)
            : <Emoji emoji="⏳" rotating="true" />
    );
}