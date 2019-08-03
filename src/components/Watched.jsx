import React, { useEffect, useState, useContext } from 'react';
import Movie from './Movie';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';
import Pagination from './Pagination';
import usePagination from '../utils/usePagination';

export default function Watched({ location, history }) {

    const [movies, setMovies] = useState([]);
    const { userInfo, globalError, PAGE_SIZE } = useContext(UserContext);
    const { currentPage, lastPage, setFirst, setLast, setPrev, setNext } = usePagination(movies, location, history)

    useEffect(() => {
        setMovies(userInfo.movies.watched);
    }, [userInfo.movies.watched]);

    const getMoviesByPage = (page) => movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const LocalPagination = <Pagination
        setFirst={setFirst}
        setPrev={setPrev}
        page={currentPage}
        last={lastPage}
        setNext={setNext}
        setLast={setLast} />

    return (
        <div>
            {globalError && <div><pre className="overflow-scroll text-xs text-red-700 whitespace-pre-wrap">{JSON.stringify(globalError)}</pre></div>}
            <h1 className="text-3xl text-center text-gray-700 m-4"><Emoji emoji="📚" /> Vistas</h1>
            {LocalPagination}
            <ul className="flex flex-wrap p-2">
                {getMoviesByPage(currentPage).map(m => <Movie key={m.movie.ids.trakt} item={m} />)}
            </ul>
            {LocalPagination}
        </div>
    );
}