import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Image from './Image';

const Movie = withRouter(({ item }) => {

    return (
        <div className="rounded-lg m-2 overflow-auto" style={{ flex: '1 0 45%' }}>
            <Link to={{ pathname: `/movie/${item.movie.ids.trakt}`, state: { item } }} >
                <Image item={item} />
            </Link>
        </div>
    );
})

export default Movie;