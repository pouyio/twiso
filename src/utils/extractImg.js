import { getImgs } from "./api";
import { getFromCache, saveToCache } from "./cache";

const findFirstValid = (posters, language) => {
    const p = posters.find(p => p.iso_639_1 === language);
    return p || posters[0];
}

const getImgUrl = async (id, type, config, language) => {
    const cachedUrl = getFromCache(id, type, language);
    if (cachedUrl) {
        return Promise.resolve(cachedUrl);
    }

    try {
        const { data } = await getImgs(id, type);
        const posterSize = config.images.profile_sizes[1];
        const poster = findFirstValid(data.posters, language);
        if (poster) {
            const url = `${config.images.secure_base_url}${posterSize}${poster.file_path}`;
            saveToCache(id, type, language, url);
            return url;
        } else {
            throw new Error(`Image not found`);
        }
    } catch (e) {
        throw new Error(`Not found in TMDB`);
    }
}

export default getImgUrl;