import React, { useEffect, useState } from 'react';
import ImageLink from './ImageLink';
import { getMoviesPopular } from '../utils/api';
import Emoji from './Emoji';


export default function Popular() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        getMoviesPopular().then(({ data }) => {
            if (!isSubscribed) {
                return;
            }
            setResults(data);
            setLoading(false);
        });
        return () => isSubscribed = false;
    }, []);

    return (
        <div>
            <h1 className="text-3xl text-center text-gray-700 mx-4 mb-4">
                <Emoji className="ml-3" emoji={loading ? '⏳' : '⭐'} rotating={loading} /> Popular</h1>
            <ul className="mt-5 flex flex-wrap justify-center">
                {results.map(r => <li key={r.movie.ids.trakt} style={{ flex: '1 0 45%', maxWidth: '15em' }}>
                    <ImageLink item={r} style={{ minHeight: '15em' }} type="movie" />
                </li>)}
            </ul>
        </div>
    );
}