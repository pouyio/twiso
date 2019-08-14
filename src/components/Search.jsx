import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/debounce';
import ImageLink from './ImageLink';
import { search as searchApi } from '../utils/api';
import Emoji from './Emoji';
import Popular from './Popular';
import useSerch from '../utils/useSearch';


export default function Search() {
    const { search, setSearch } = useSerch();
    const [loading, setLoading] = useState(false);
    const [movieResults, setMovieResults] = useState([]);
    const [showResults, setShowResults] = useState([]);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(
        () => {
            if (!debouncedSearch) {
                setMovieResults([]);
                setShowResults([]);
                return;
            }

            setLoading(true);
            let isSubscribed = true;
            Promise.all([searchApi(debouncedSearch, 'movie'), searchApi(debouncedSearch, 'show')]).then(([movies, shows]) => {
                if (!isSubscribed) {
                    return;
                }
                setMovieResults(movies.data);
                setShowResults(shows.data);
                setLoading(false);
            });
            return () => isSubscribed = false;
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

            {search || movieResults.length ?
                <>
                    <h1 className="text-3xl mt-4 text-gray-700">Películas </h1>
                    <ul className="-mx-2 -mt-2 flex flex-wrap justify-center">
                        {movieResults.map(r => <li key={r.movie.ids.trakt} className="p-2" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                            <ImageLink item={r} style={{ minHeight: '15em' }} type="movie" />
                        </li>)}
                    </ul>
                </>
                : <Popular type="movie" />}

            {(search || showResults.length) ?
                <>
                    <h1 className="text-3xl mt-4 text-gray-700">Series </h1>
                    <ul className="-mx-2 -mt-2 flex flex-wrap justify-center">
                        {showResults.map(r => <li key={r.show.ids.trakt} className="p-2" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                            <ImageLink item={r} style={{ minHeight: '15em' }} type="show" />
                        </li>)}
                    </ul>
                </>
                : <Popular type="show" />}

        </div>
    );
}