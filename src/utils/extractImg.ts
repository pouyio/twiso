import { getImgsApi } from './api';
import { getFromCache, saveToCache } from './cache';
import { BaseImage, ImgConfig } from '../models';

const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find(p => p.iso_639_1 === language);
  return p || images[0];
};

const getImgUrl = async (
  id: number,
  type: 'show' | 'movie' | 'person',
  config: ImgConfig,
  language: string,
  size: 'small' | 'big',
) => {
  const cachedUrl = getFromCache(id, type, language);
  const imgArrSize = size === 'small' ? 1 : 2;
  if (cachedUrl) {
    return Promise.resolve(
      cachedUrl.replace('__size__', config.images.profile_sizes[imgArrSize]),
    );
  }

  try {
    const { data } = await getImgsApi(id, type);
    const poster = findFirstValid((data.posters || data.profiles)!, language);
    if (poster) {
      const url = `${config.images.secure_base_url}__size__${poster.file_path}`;
      saveToCache(id, type, language, url);
      return url.replace('__size__', config.images.profile_sizes[imgArrSize]);
    } else {
      throw new Error(`Image not found`);
    }
  } catch (e) {
    throw new Error(`Not found in TMDB`);
  }
};

export default getImgUrl;
