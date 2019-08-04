import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const Movie = ({ item }) => {

    return (
        <div className="p-2 overflow-auto" style={{ flex: '1 0 45%', maxWidth: '15em' }}>
            <Link to={{ pathname: `/movie/${item.movie.ids.trakt}`, state: { item } }} >
                <Image item={item} delay={200} />
            </Link>
        </div>
    );
}

export default Movie;