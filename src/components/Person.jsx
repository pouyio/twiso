import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import Image from './Image';
import CollapsableText from './CollapsableText';
import { getPersonItemsApi, getPersonApi } from '../utils/api';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';


export default function Person({ match: { params: { id } } }) {
    const [localState, setLocalState] = useState();
    const [movieResults, setMovieResults] = useState([]);
    const [showResults, setShowResults] = useState([]);

    const { language } = useContext(UserContext);

    useEffect(
        () => {
            getPersonApi(id).then(({ data }) => setLocalState(data));
            getPersonItemsApi(id, 'show')
                .then(({ data }) => {
                    setShowResults(data.cast.map(r => ({ show: r.show, type: 'show', title: r.character })).filter(r => !(r.title === 'Himself' || r.title === 'Herself')));
                });
            getPersonItemsApi(id, 'movie')
                .then(({ data }) => {
                    setMovieResults([
                        ...data.cast
                            .map(r => ({ movie: r.movie, type: 'movie', title: r.character })).filter(r => r.title !== 'Himself'),
                        ...((data.crew || {}).directing || [])
                            .map(r => ({ movie: r.movie, type: 'movie', title: r.job }))
                            .filter(r => !(r.title === 'Himself' || r.title === 'Herself'))
                    ]);
                });
        }, [id, language]);

    return (
        localState ? (
            <div className="bg-gray-300">
                <div className="p-10 sticky top-0 z-0" style={{ minHeight: '15em' }}>
                    {localState && <Image item={{ person: localState, type: 'person' }} type="person" />}
                </div>

                <article className="relative p-4 bg-white z-10 rounded-t-lg" style={{ 'transform': 'translate3d(0,0,0)' }}>
                    <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
                    <h1 className="text-4xl leading-none text-center mb-4">
                        {localState.name}
                    </h1>
                    <div className="flex flex-wrap mb-4 justify-between items-center text-gray-600">
                        <h2>{new Date(localState.birthday).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })} </h2>
                        {localState.death && <h2> <Emoji emoji="✝️" /> {new Date(localState.death).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</h2>}
                        {localState.birthplace && <h2>{localState.birthplace}</h2>}
                    </div>

                    <div className="my-4 relative">
                        <p>Biografía:</p>
                        <CollapsableText className="leading-tight font-light">{localState.biography || 'Sin descripción'}</CollapsableText>
                    </div>

                    {movieResults.length ? <>
                        <h1 className="text-3xl mt-8 text-gray-700">Películas </h1>
                        <ul className="-mx-2 -mt-2 flex flex-wrap justify-center">
                            {movieResults.map((r, i) => <li key={`${r.movie.ids.trakt}-movie-${i}`} className="p-2 h-full" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                                <div className="bg-gray-300 rounded-lg">
                                    <ImageLink item={r} type="movie">
                                        {r.title && <p className="text-sm text-gray-700 text-center py-1">{r.title}</p>}
                                    </ImageLink>
                                </div>
                            </li>)}
                        </ul>
                    </> : null
                    }


                    {showResults.length ?
                        <>
                            <h1 className="text-3xl mt-8 text-gray-700">Series </h1>
                            <ul className="-mx-2 -mt-2 flex flex-wrap justify-center">
                                {showResults.map((r, i) => <li key={`${r.show.ids.trakt}-show-${i}`} className="p-2 h-full" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                                    <div className="bg-gray-300 rounded-lg">
                                        <ImageLink item={r} type="show">
                                            {r.title && <p className="text-sm text-gray-700 text-center py-1">{r.title}</p>}
                                        </ImageLink>
                                    </div>
                                </li>)}
                            </ul>
                        </> : null
                    }

                </article>

            </div>
        ) : <Emoji emoji="⏳" rotating={true} />
    );
}