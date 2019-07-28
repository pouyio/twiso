import React, { useEffect, useState, useContext } from 'react';
import Movie from './Movie';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';

export default function Watched() {

    const [movies, setMovies] = useState([]);
    const { userInfo, globalError } = useContext(UserContext);

    useEffect(() => {
        setMovies(userInfo.movies.watched);
    }, [userInfo]);

    return (
        <div>
            {globalError && <div><pre className="overflow-scroll text-xs text-red-700 whitespace-pre-wrap">{JSON.stringify(globalError)}</pre></div>}
            <h1 className="text-3xl text-center text-gray-700 m-4"><Emoji emoji={'📚'} /> Vistas</h1>
            <ul className="flex flex-wrap p-2">
                {movies.map(m => <Movie key={m.movie.ids.trakt} item={m} />)}
            </ul>
        </div>
    );
}