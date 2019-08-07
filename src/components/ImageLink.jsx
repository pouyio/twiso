import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const ImageLink = ({ item, style, type }) => {

    return (
        <div className="p-2 overflow-auto">
            <Link to={{ pathname: `/${type}/${item[type].ids.trakt}`, state: { item } }} >
                <Image item={item} style={style}/>
            </Link>
        </div>
    );
}

export default ImageLink;