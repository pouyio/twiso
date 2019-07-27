import axios from 'axios';

const trakt_api_key = process.env.REACT_APP_TRAKT_API_KEY;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const tmbdb_api_key = process.env.REACT_APP_TMDB_API_KEY;
const content_type = 'application/json';
const trakt_api_version = 2;
const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.trakt.tv';
const LOGIN_URL = 'https://cors-anywhere.herokuapp.com/https://trakt.tv/oauth/token';
const IMG_URL = 'https://api.themoviedb.org/3';

const base_headers = {
    'content-type': content_type,
    'trakt-api-key': trakt_api_key,
    'trakt-api-version': trakt_api_version
}

export const login = (code) => {
    return axios.post(LOGIN_URL, {
        code,
        client_secret,
        client_id: trakt_api_key,
        redirect_uri: "http://localhost:3000",
        grant_type: "authorization_code"
    });
}

export const getImgsConfig = () => {
    return axios.get(`${IMG_URL}/configuration?api_key=${tmbdb_api_key}`);
}

export const getImgs = (id) => {
    return axios.get(`${IMG_URL}/movie/${id}/images?api_key=${tmbdb_api_key}&include_image_language=es,en`);
}

export const getMovie = (id) => {
    return axios.get(`${BASE_URL}/search/trakt/${id}?type=movie&extended=full`, {
        headers: base_headers
    });
}

export const getMovieTranslations = (session, id) => {
    return axios.get(`${BASE_URL}/movies/${id}/translations/es`, {
        headers: base_headers,
        'Authorization': `Bearer ${session.access_token}`
    });
}

export const searchMovie = (query) => {
    return axios.get(`${BASE_URL}/search/movie?query=${query}&extended=full`, {
        headers: base_headers
    });
}

export const getMoviesWatched = (session) => {
    return axios.get(`${BASE_URL}/sync/history/movies?extended=full`, {
        headers: {
            ...base_headers,
            'Authorization': `Bearer ${session.access_token}`
        }
    });
}

export const addMovieWatched = (movie, session) => {
    return axios.post(`${BASE_URL}/sync/history`, {
        movies: [movie]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const removeMovieWatched = (movie, session) => {
    return axios.post(`${BASE_URL}/sync/history/remove`, {
        movies: [movie]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const getMoviesWatchlist = (session) => {
    return axios.get(`${BASE_URL}/sync/watchlist/movies?extended=full`, {
        headers: {
            ...base_headers,
            'Authorization': `Bearer ${session.access_token}`
        }
    });
}

export const addMovieWatchlist = (movie, session) => {
    return axios.post(`${BASE_URL}/sync/watchlist`, {
        movies: [movie]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const removeMovieWatchlist = (movie, session) => {
    return axios.post(`${BASE_URL}/sync/watchlist/remove`, {
        movies: [movie]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}
