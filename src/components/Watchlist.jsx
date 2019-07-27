import React, { useEffect, useState, useContext } from 'react';
import Movie from './Movie';
import UserContext from '../utils/UserContext';

export default function Watchlist() {

    const [movies, setMovies] = useState([]);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        setMovies(userInfo.movies.watchlist);
    }, [userInfo]);

    return (
        <div>
            <h1>Pendientes</h1>
            <ul>
                {movies.map(m => <Movie key={m.movie.ids.trakt} item={m} />)}
            </ul>
        </div>
    );
}