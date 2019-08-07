import React, { useEffect, useState, useContext } from 'react';
import ImageLink from './ImageLink';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';
import PaginationContainer from './PaginationContainer';
import usePagination from '../utils/usePagination';

export default function Series() {

    const [shows, setShows] = useState([]);
    const { userInfo, PAGE_SIZE } = useContext(UserContext);
    const { currentPage } = usePagination(shows);

    useEffect(() => {
        setShows(userInfo.shows.watched);
    }, [userInfo.shows.watched]);

    const getMoviesByPage = (page) => shows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <h1 className="text-3xl text-center text-gray-700 m-4"><Emoji emoji="⏱" /> Siguiendo</h1>
            <PaginationContainer items={shows}>
                <ul className="flex flex-wrap p-2 justify-center">
                    {getMoviesByPage(currentPage).map(m => <li key={m.show.ids.trakt} style={{ flex: '1 0 45%', maxWidth: '15em' }}>
                        <ImageLink item={m} style={{ minHeight: '15em' }} type="show"/>
                    </li>)}
                </ul>
            </PaginationContainer>
        </div>
    );
}