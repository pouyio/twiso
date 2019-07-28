import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/debounce';
import Movie from './Movie';
import { searchMovie } from '../utils/api';
import Emoji from './Emoji';


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
        <div className="m-4">
            <div className="w-full flex items-center">
                <input className="bg-gray-300 text-black px-2 py-1 rounded outline-none flex-grow text-gray-700" type="text" placeholder="🔍 Busca una película" autoFocus={true} onChange={(e) => setQuery(e.target.value)} value={query} />
                {loading ?
                    <Emoji className="ml-3" emoji={'⏳'} rotating={true} />
                    : <Emoji className="ml-3" emoji={'❌'} onClick={() => setQuery('')} />}
            </div>
            <ul className="mt-5 flex flex-wrap">
                {results.length ?
                    results.map(r => <Movie key={r.movie.ids.trakt} item={r} />)
                    : <h1 className="text-4xl text-gray-700">Sin resultados</h1>}
            </ul>
        </div>
    );
}