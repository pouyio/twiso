import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const ImageLink = ({ item, style, type, children }) => {

    return (
        <Link to={{ pathname: `/${type}/${item[type].ids.trakt}`, state: { item } }} >
            <Image item={item} style={style} type={type} />
            {children}
        </Link>
    );
}

export default ImageLink;