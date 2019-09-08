import { getImgsApi } from './api';
import { getFromCache, saveToCache } from './cache';

const findFirstValid = (images, language) => {
  const p = images.find(p => p.iso_639_1 === language);
  return p || images[0];
};

const getImgUrl = async (id, type, config, language) => {
  const cachedUrl = getFromCache(id, type, language);
  if (cachedUrl) {
    return Promise.resolve(cachedUrl);
  }

  try {
    const { data } = await getImgsApi(id, type);
    const posterSize = config.images.profile_sizes[1];
    const poster = findFirstValid(data.posters || data.profiles, language);
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
};

export default getImgUrl;
