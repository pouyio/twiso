import React, { useEffect, useState } from 'react';
import { getMoviesRelated } from '../utils/api';
import Movie from './Movie';

export default function Related({ itemId }) {

    const [restuls, setResults] = useState([]);

    useEffect(() => {
        getMoviesRelated(itemId).then(({ data }) => {
            setResults(data.map(d => ({ movie: d })));
        })
    }, [itemId]);

    return (
        <ul className="flex overflow-x-auto -mr-4" style={{WebkitOverflowScrolling: 'touch'}}>
            {restuls.map(r => <li key={r.movie.ids.trakt} style={{minWidth: '45%'}}>
                <Movie item={r}/>
            </li>)
            }
        </ul >
    );
}