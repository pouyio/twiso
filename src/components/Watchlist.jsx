import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';
import PaginationContainer from './PaginationContainer';
import usePagination from '../utils/usePagination';

export default function Watchlist() {

    const [movies, setMovies] = useState([]);
    const { userInfo, PAGE_SIZE } = useContext(UserContext);
    const { currentPage } = usePagination(movies);

    useEffect(() => {
        setMovies(userInfo.movies.watchlist);
    }, [userInfo.movies.watchlist]);

    const getMoviesByPage = (page) => movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <h1 className="text-3xl text-center text-gray-700 m-4"><Emoji emoji="⏱" /> Pendientes {movies.length}</h1>
            <PaginationContainer items={movies}>
                <ul className="flex flex-wrap p-2 items-stretch justify-center">
                    {getMoviesByPage(currentPage).map(m => <li key={m.movie.ids.trakt} className="p-2" style={{ flex: '1 0 50%', maxWidth: '15em' }}>
                        <ImageLink item={m} style={{ minHeight: '15em' }} type="movie"/>
                    </li>)}
                </ul>
            </PaginationContainer>
        </div>
    );
}