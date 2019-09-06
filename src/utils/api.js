import axios from 'axios';
import { PAGE_SIZE } from './UserContext';
import rateLimit from 'axios-rate-limit';

const trakt_api_key = process.env.REACT_APP_TRAKT_API_KEY;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const tmbdb_api_key = process.env.REACT_APP_TMDB_API_KEY;
const redirect_url = process.env.REACT_APP_REDIRECT_URL;
const content_type = 'application/json';
const trakt_api_version = 2;
const BASE_URL = 'https://api.trakt.tv';
const LOGIN_URL = 'https://trakt.tv/oauth/token';
const IMG_URL = 'https://api.themoviedb.org/3';

const base_headers = {
    'content-type': content_type,
    'trakt-api-key': trakt_api_key,
    'trakt-api-version': trakt_api_version
}

const limitAxios = rateLimit(axios.create(), { maxRequests: 42, perMilliseconds: 10000 });

export const loginApi = (code) => {
    return axios.post(LOGIN_URL, {
        code,
        client_secret,
        client_id: trakt_api_key,
        redirect_uri: redirect_url,
        grant_type: "authorization_code"
    });
}

export const getImgsConfigApi = () => {
    return axios.get(`${IMG_URL}/configuration?api_key=${tmbdb_api_key}`);
}

export const getImgsApi = (id, type) => {
    let newType = type;
    if (type === 'show') {
        newType = 'tv';
    }
    return limitAxios.get(`${IMG_URL}/${newType}/${id}/images?api_key=${tmbdb_api_key}&include_image_language=es,en`);
}

export const getApi = (id, type) => {
    return axios.get(`${BASE_URL}/search/trakt/${id}?type=${type}&extended=full`, {
        headers: base_headers
    });
}

export const getSeasonsApi = (id) => {
    return axios.get(`${BASE_URL}/shows/${id}/seasons?extended=episodes`, {
        headers: base_headers
    });
}

export const getSeasonApi = (id, season) => {
    return axios.get(`${BASE_URL}/shows/${id}/seasons/${season}?extended=full`, {
        headers: base_headers
    });
}

export const getProgressApi = (session, id) => {
    return axios.get(`${BASE_URL}/shows/${id}/progress/watched?specials=true`, {
        headers: {
            ...base_headers,
            'Authorization': `Bearer ${session.access_token}`
        }
    });
}

export const getTranslationsApi = (id, type) => {
    return axios.get(`${BASE_URL}/${type}s/${id}/translations/es`, {
        headers: base_headers
    });
}

export const getEpisodeTranslationApi = (id, season, episode) => {
    return axios.get(`${BASE_URL}/shows/${id}/seasons/${season}/episodes/${episode}/translations/es`, {
        headers: base_headers
    });
}

export const searchApi = (query, type) => {
    return axios.get(`${BASE_URL}/search/${type}?query=${query}&extended=full&page=1&limit=${Math.round(PAGE_SIZE / 14)}`, {
        headers: base_headers
    });
}

export const getWatchedApi = (session, type) => {
    const url = type === 'movie' ?
        `${BASE_URL}/sync/history/movies?page=1&limit=10000&extended=full`
        : `${BASE_URL}/sync/watched/shows?extended=full`;

    return axios.get(url, {
        headers: {
            ...base_headers,
            'Authorization': `Bearer ${session.access_token}`
        }
    }).then(res => {
        const mapped = res.data.map(s => ({ ...s, type }));
        res.data = mapped;
        return res;
    });
}

export const addWatchedApi = (item, session, type) => {
    return axios.post(`${BASE_URL}/sync/history`, {
        [`${type}s`]: [item]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const removeWatchedApi = (item, session, type) => {
    return axios.post(`${BASE_URL}/sync/history/remove`, {
        [`${type}s`]: [item]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const getWatchlistApi = (session, type) => {
    return axios.get(`${BASE_URL}/sync/watchlist/${type}s?extended=full`, {
        headers: {
            ...base_headers,
            'Authorization': `Bearer ${session.access_token}`
        }
    }).then(res => {
        const ordered = res.data.sort((a, b) => new Date(b.listed_at) - new Date(a.listed_at));
        res.data = ordered;
        return res;
    });
}

export const addWatchlistApi = (item, session, type) => {
    return axios.post(`${BASE_URL}/sync/watchlist`, {
        [`${type}s`]: [item]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const removeWatchlistApi = (item, session, type) => {
    return axios.post(`${BASE_URL}/sync/watchlist/remove`, {
        [`${type}s`]: [item]
    }, {
            headers: {
                ...base_headers,
                'Authorization': `Bearer ${session.access_token}`
            }
        });
}

export const getPeopleApi = (id, type) => {
    return axios.get(`${BASE_URL}/${type}s/${id}/people`, {
        headers: {
            ...base_headers
        }
    });
}

export const getPersonApi = (id) => {
    return axios.get(`${BASE_URL}/people/${id}?extended=full`, {
        headers: {
            ...base_headers
        }
    });
}

export const getPersonItemsApi = (person, type) => {
    return axios.get(`${BASE_URL}/people/${person}/${type}s?extended=full`, {
        headers: {
            ...base_headers
        }
    });
}

export const getPopularApi = (type) => {
    const year = new Date().getFullYear();
    return axios.get(`${BASE_URL}/${type}s/watched/weekly?extended=full&page=1&limit=${PAGE_SIZE}&years=${year}`, {
        headers: {
            ...base_headers
        }
    }).then(res => {
        const mapped = res.data.map(m => ({ ...m, type }));
        res.data = mapped;
        return res;
    });
}

export const getRelatedApi = (id, type) => {
    return axios.get(`${BASE_URL}/${type}s/${id}/related?extended=full&page=1&limit=10`, {
        headers: {
            ...base_headers
        }
    }).then(res => {
        const mapped = res.data.map(m => ({ [type]: { ...m }, type }));
        res.data = mapped;
        return res;
    });
}