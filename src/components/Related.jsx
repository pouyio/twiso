import React, { useEffect, useState } from 'react';
import { getRelated } from '../utils/api';
import ImageLink from './ImageLink';
import Emoji from './Emoji';

export default function Related({ itemId, type }) {

    const [results, setResults] = useState([]);

    useEffect(() => {
        getRelated(type, itemId).then(({ data }) => {
            setResults(data);
        })
    }, [itemId, type]);

    return (
        <>{
            results.length ?
                <ul className="flex overflow-x-auto -mr-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {results.map(r => <li key={r[type].ids.trakt} className="p-2" style={{ minWidth: '50%' }}>
                        <ImageLink item={r} type={type} />
                    </li>)
                    }
                </ul >
                : <span className="bg-gray-200 inline-block my-2 font-light px-3 py-2 rounded-full">Ninguno <Emoji emoji="😵" /></span>
        }</>
    );
}