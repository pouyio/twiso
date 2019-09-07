import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/debounce';
import ImageLink from './ImageLink';
import { searchApi } from '../utils/api';
import Emoji from './Emoji';
import Popular from './Popular';
import useSerch from '../utils/useSearch';


export default function Search() {
    const { search, setSearch } = useSerch();
    const [loading, setLoading] = useState(false);
    const [movieResults, setMovieResults] = useState([]);
    const [showResults, setShowResults] = useState([]);
    const [peopleResults, setPeopleResults] = useState([]);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(
        () => {
            if (!debouncedSearch) {
                setMovieResults([]);
                setShowResults([]);
                setPeopleResults([]);
                return;
            }

            setLoading(true);
            let isSubscribed = true;
            searchApi(debouncedSearch, 'movie,show,person').then(({ data }) => {
                const movies = data.filter(r => r.type === 'movie');
                const shows = data.filter(r => r.type === 'show');
                const person = data.filter(r => r.type === 'person');
                if (!isSubscribed) {
                    return;
                }
                setMovieResults(movies);
                setShowResults(shows);
                setPeopleResults(person);
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

            {search ? (
                <>
                    {movieResults.length ?
                        <>
                            <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">Películas</h1>
                            <ul className="-mx-2 -mt-2 flex flex-col flex-wrap content-start overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}>
                                {movieResults.map(r => <li key={r.movie.ids.slug} className="p-2" style={{ height: '13.5em', maxWidth: '9em' }}>
                                    <ImageLink item={r} style={{ minHeight: '10em' }} type="movie" />
                                </li>)}
                            </ul>
                        </>
                        : <h1 className="text-3xl mt-8 text-gray-700">No hay películas</h1>
                    }

                    {showResults.length ?
                        <>
                            <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">Series</h1>
                            <ul className="-mx-2 -mt-2 flex flex flex-col flex-wrap content-start overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}>
                                {showResults.map(r => <li key={r.show.ids.slug} className="p-2" style={{ height: '13.5em', maxWidth: '9em' }}>
                                    <ImageLink item={r} style={{ minHeight: '10em' }} type="show" />
                                </li>)}
                            </ul>
                        </>
                        : <h1 className="text-3xl mt-8 text-gray-700">No hay series</h1>
                    }

                    {peopleResults.length ?
                        <>
                            <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">Personas</h1>
                            <ul className="-mx-2 -mt-2 flex flex flex-col flex-wrap content-start overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}>
                                {peopleResults.map(r => <li key={r.person.ids.slug} className="p-2" style={{ height: '13.5em', maxWidth: '9em'  }}>
                                    <ImageLink item={r} style={{ minHeight: '10em' }} type="person" />
                                </li>)}
                            </ul>
                        </>
                        : <h1 className="text-3xl mt-8 text-gray-700">No hay personas</h1>
                    }

                </>
            ) : (
                    <>
                        <Popular type="movie" />
                        <Popular type="show" />
                    </>
                )

            }
        </div >
    );
}