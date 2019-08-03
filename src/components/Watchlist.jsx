import React, { useEffect, useState, useContext } from 'react';
import Movie from './Movie';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';
import Pagination from './Pagination';
import usePagination from '../utils/usePagination';

export default function Watchlist({ location, history }) {

    const [movies, setMovies] = useState([]);
    const { userInfo, PAGE_SIZE } = useContext(UserContext);
    const { currentPage, lastPage, setFirst, setLast, setPrev, setNext } = usePagination(movies, location, history)

    useEffect(() => {
        setMovies(userInfo.movies.watchlist);
    }, [userInfo.movies.watchlist]);

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
            <h1 className="text-3xl text-center text-gray-700 m-4"><Emoji emoji={'⏱'} /> Pendientes</h1>
            {LocalPagination}
            <ul className="flex flex-wrap p-2">
                {getMoviesByPage(currentPage).map(m => <Movie key={m.movie.ids.trakt} item={m} />)}
            </ul>
            {LocalPagination}
        </div>
    );
}