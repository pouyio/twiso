import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import CollapsableText from './CollapsableText';
import { getPersonItemsApi, getPersonApi } from '../utils/api';
import UserContext from '../utils/UserContext';


export default function Person({ match: { params: { id } } }) {
    const [localState, setLocalState] = useState();
    const [movieResults, setMovieResults] = useState([]);
    const [showResults, setShowResults] = useState([]);
    const { language } = useContext(UserContext);

    useEffect(
        () => {
            getPersonApi(id).then(({ data }) => setLocalState(data));
            getPersonItemsApi(id).then(({ data }) => {
                const movies = data.filter(r => r.type === 'movie');
                const shows = data.filter(r => r.type === 'show');
                setMovieResults(movies);
                setShowResults(shows);
            });
        }, [id]);

    return (
        <div className="m-4">
            {
                localState && (
                    <>
                        <h1 className="text-4xl leading-none text-center mb-4">
                            {localState.name}
                        </h1>
                        <div className="flex flex-wrap mb-4 justify-center text-gray-600">
                            <h2>{new Date(localState.birthday).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })} </h2>
                            {localState.death && <h2> - {new Date(localState.death).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</h2>}
                            {localState.birthplace && <h2>{localState.birthplace}</h2>}
                        </div>

                        <div className="my-4 relative">
                            <p>Biografía:</p>
                            <CollapsableText className="leading-tight font-light">{localState.biography || 'Sin descripción'}</CollapsableText>
                        </div>

                    </>
                )
            }
            <h1 className="text-3xl mt-8 text-gray-700">Películas </h1>
            <ul className="-mx-2 -mt-2 flex flex-wrap justify-center">
                {movieResults.map(r => <li key={r.movie.ids.trakt} className="p-2" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                    <ImageLink item={r} style={{ minHeight: '15em' }} type="movie" />
                </li>)}
            </ul>
            <h1 className="text-3xl mt-8 text-gray-700">Series </h1>
            <ul className="-mx-2 -mt-2 flex flex-wrap justify-center">
                {showResults.map(r => <li key={r.show.ids.trakt} className="p-2" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                    <ImageLink item={r} style={{ minHeight: '15em' }} type="show" />
                </li>)}
            </ul>

        </div>
    );
}