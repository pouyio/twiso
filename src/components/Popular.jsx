import React, { useEffect, useState } from 'react';
import ImageLink from './ImageLink';
import { getPopular } from '../utils/api';
import Emoji from './Emoji';


export default function PopularMovies({ type }) {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(true);
    const [results, setResults] = useState([]);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        getPopular(type).then(({ data }) => {
            if (!isSubscribed) {
                return;
            }
            setResults(data);
            setLoading(false);
        });
        return () => isSubscribed = false;
    }, [type]);

    const getTitle = () => {
        switch (type) {
            case 'show':
                return "Series";
            case 'movie':
                return 'Películas'
            default:
                break;
        }
    }

    const toggleShow = () => setShow(!show);

    return (
        <div>
            <h1 className="text-3xl text-center text-gray-700 m-4 mt-8 flex items-baseline" onClick={toggleShow}>
                <Emoji className="ml-3" emoji={loading ? '⏳' : '⭐'} rotating={loading} /> {getTitle()} populares <Emoji className="text-base" emoji={show ? '🔽' : '🔼'} /></h1>
            {show &&
                <ul className="mt-5 flex flex-wrap justify-center">
                    {results.map(r => <li key={r[type].ids.trakt} className="p-2" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                        <ImageLink item={r} style={{ minHeight: '15em' }} type={type} />
                    </li>)}
                </ul>
            }
            <div className="h-1 border-2 rounded-full m-8"></div>
        </div>
    );
}