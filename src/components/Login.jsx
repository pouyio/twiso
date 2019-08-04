import React, { useEffect, useContext } from 'react';
import AuthContext from '../utils/AuthContext';
import { login } from '../utils/api';

export default function Login({ code, history }) {

    const { persistSession } = useContext(AuthContext);

    useEffect(() => {
        login(code).then(({ data }) => {
            persistSession(data);
            history.push('/watched')
        });
    });

    return <h1 className="text-2xl">Loading...</h1>
}
