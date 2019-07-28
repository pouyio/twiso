import React, { useEffect, useState, useContext } from 'react';
import Movie from './Movie';
import UserContext from '../utils/UserContext';

export default function Watched() {

    const [movies, setMovies] = useState([]);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        setMovies(userInfo.movies.watched);
    }, [userInfo]);

    return (
        <div>
            <h1>Vistas</h1>
            <ul className="flex flex-wrap">
                {movies.map(m => <Movie key={m.movie.ids.trakt} item={m} />)}
            </ul>
        </div>
    );
}