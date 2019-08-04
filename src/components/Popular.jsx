import React, { useEffect, useState } from 'react';
import Movie from './Movie';
import { getMoviesPopular } from '../utils/api';
import Emoji from './Emoji';


export default function Popular() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        setLoading(true);
        getMoviesPopular().then(({ data }) => {
            setResults(data);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            <h1 className="text-3xl text-center text-gray-700 mx-4 mb-4">
                <Emoji className="ml-3" emoji={loading ? '⏳' : '⭐'} rotating={loading} /> Popular</h1>
            <ul className="mt-5 flex flex-wrap justify-center">
                {results.map(r => <Movie key={r.movie.ids.trakt} item={r} />)}
            </ul>
        </div>
    );
}