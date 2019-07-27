import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import WatchButton from './WatchButton';
import Image from './Image';
import useTranslate from '../utils/useTranslate';

const Movie = withRouter(({ item }) => {

    const { title } = useTranslate(item);

    return (
        <div>
            <Link to={{ pathname: `/movie/${item.movie.ids.trakt}`, state: { item } }} >
                <h2>{title}</h2>
                <Image item={item} />
            </Link>
            <WatchButton item={item} />
        </div>
    );
})

export default Movie;