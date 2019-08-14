import React from 'react';
import Emoji from './Emoji';
import getGenre from '../utils/getGenre';

const Genres = ({
    genres
}) => {

    return (
        genres.length ?
            <ul className="flex overflow-x-auto my-2 -mr-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                {genres.map(g => (
                    <li key={g} className="bg-gray-200 font-light px-3 py-2 rounded-full mx-1 whitespace-pre"><Emoji emoji={getGenre(g).emoji} /> {getGenre(g).name}</li>
                ))}
            </ul>
            : <span className="bg-gray-200 inline-block my-2 font-light px-3 py-2 rounded-full">Ninguno <Emoji emoji="😵" /></span>

    );
}

export default Genres;