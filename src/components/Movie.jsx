import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const Movie = ({ item, style }) => {

    return (
        <div className="p-2 overflow-auto">
            <Link to={{ pathname: `/movie/${item.movie.ids.trakt}`, state: { item } }} >
                <Image item={item} style={style}/>
            </Link>
        </div>
    );
}

export default Movie;