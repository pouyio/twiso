export const saveToCache = (id, type, language, url) => {
    localStorage.setItem(`${id}-${type}-${language}`, url);
}

export const getFromCache = (id, type, language) => {
    return localStorage.getItem(`${id}-${type}-${language}`);
}