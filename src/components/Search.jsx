import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/debounce';
import Movie from './Movie';
import { searchMovie } from '../utils/api';
import Emoji from './Emoji';
import Popular from './Popular';
import useSerch from '../utils/useSearch';


export default function Search() {
    const { search, setSearch } = useSerch();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(
        () => {
            if (!debouncedSearch) {
                setResults([])
                return;
            }
            setLoading(true);
            searchMovie(debouncedSearch).then(({ data }) => {
                setResults(data);
                setLoading(false);
            });
        },
        [debouncedSearch]
    );

    return (
        <div className="m-4">
            <div className="w-full flex items-center md:max-w-md m-auto">
                <input className="bg-gray-300 text-black px-2 py-1 rounded outline-none flex-grow text-gray-700" type="text" placeholder="🔍 Busca una película" autoFocus={true} onChange={(e) => setSearch(e.target.value)} value={search} />
                {loading ?
                    <Emoji className="ml-3" emoji="⏳" rotating={true} />
                    : <Emoji className="ml-3" emoji="❌" onClick={() => setSearch('')} />}
            </div>
            <ul className="mt-5 flex flex-wrap justify-center">
                {search || results.length ?
                    results.map(r => <li key={r.movie.ids.trakt} style={{ flex: '1 0 45%', maxWidth: '15em' }}>
                        <Movie item={r} style={{ minHeight: '15em' }}/>
                    </li>)
                    : <Popular />}
            </ul>
        </div>
    );
}