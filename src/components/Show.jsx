import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const Show = ({ item, style }) => {

    return (
        <div className="p-2 overflow-auto">
            <Link to={{ pathname: `/show/${item.show.ids.trakt}`, state: { item } }} >
                <Image item={item} style={style} />
            </Link>
        </div>
    );
}

export default Show;