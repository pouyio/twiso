import React, { useEffect, useState } from 'react';
import { getRelated } from '../utils/api';
import ImageLink from './ImageLink';

export default function Related({ itemId, type }) {

    const [restuls, setResults] = useState([]);

    useEffect(() => {
        getRelated(type, itemId).then(({ data }) => {
            setResults(data);
        })
    }, [itemId, type]);

    return (
        <ul className="flex overflow-x-auto -mr-4" style={{WebkitOverflowScrolling: 'touch'}}>
            {restuls.map(r => <li key={r[type].ids.trakt} style={{minWidth: '45%'}}>
                <ImageLink item={r} type={type}/>
            </li>)
            }
        </ul >
    );
}