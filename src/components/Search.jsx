import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/debounce';
import Movie from './Movie';
import { searchMovie } from '../utils/api';


export default function Search() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const debouncedQuery = useDebounce(query, 500);

    useEffect(
        () => {
            if (!debouncedQuery) {
                setResults([])
                return;
            }
            setLoading(true);
            searchMovie(debouncedQuery).then(({ data }) => {
                setResults(data)
                setLoading(false);
            });
        },
        [debouncedQuery]
    );


    return (
        <div>
            <h1>This is search!</h1>
            <input type="text" placeholder="Search movie and show" autoFocus={true} onChange={(e) => setQuery(e.target.value)} />
            {loading && <span role="img" aria-label="emoji">⏳</span>}
            <ul>
                {results.map(r => <Movie key={r.movie.ids.trakt} item={r} />)}
            </ul>
        </div>
    );
}