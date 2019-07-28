import React, { useEffect, useState, useContext } from 'react';
import Movie from './Movie';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';

export default function Watchlist() {

    const [movies, setMovies] = useState([]);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        setMovies(userInfo.movies.watchlist);
    }, [userInfo]);

    return (
        <div>
            <h1 className="text-3xl text-center text-gray-700 m-4"><Emoji emoji={'⏱'} /> Pendientes</h1>
            <ul className="flex flex-wrap p-2">
                {movies.map(m => <Movie key={m.movie.ids.trakt} item={m} />)}
            </ul>
        </div>
    );
}