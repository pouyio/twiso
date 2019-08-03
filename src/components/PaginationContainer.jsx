import React from 'react';
import Pagination from './Pagination';
import usePagination from '../utils/usePagination';

export default function PaginationContainer({ children, movies }) {

    const { currentPage, lastPage, setFirst, setLast, setPrev, setNext } = usePagination(movies);

    const LocalPagination = <Pagination
        setFirst={setFirst}
        setPrev={setPrev}
        page={currentPage}
        last={lastPage}
        setNext={setNext}
        setLast={setLast} />

    return (
        <div>
            {LocalPagination}
            {children}
            {LocalPagination}
        </div>
    );
}