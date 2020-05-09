import { getImgsApi } from '../utils/api';
import { getFromCache, saveToCache } from '../utils/cache';
import { useState, useEffect } from 'react';
import { useGlobalState } from 'state/store';
import { findFirstValid } from 'utils/findFirstValidImage';

export const useImage = (
  id: number,
  type: 'show' | 'movie' | 'person',
  size: 'small' | 'big',
  inview: boolean,
) => {
  const [imgUrl, setImgUrl] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [message, setMessage] = useState('');
  const {
    state: { language, config },
  } = useGlobalState();

  useEffect(() => {
    setImgPreview('');
    setImgUrl('');
    if (!config) {
      return;
    }
    if (!id) {
      setMessage('No id');
      return;
    }

    const cachedUrl = getFromCache(id, type, language);
    const imgArrSize = size === 'small' ? 1 : 2;
    if (cachedUrl) {
      setImgPreview(
        cachedUrl.replace('__size__', config.images.profile_sizes[1]),
      );
      setImgUrl(
        cachedUrl.replace('__size__', config.images.profile_sizes[imgArrSize]),
      );
      return;
    }

    if (!inview) {
      return;
    }

    getImgsApi(id, type)
      .then(({ data }) => {
        const poster = findFirstValid(
          (data.posters || data.profiles)!,
          language,
        );
        if (poster) {
          const url = `${config.images.secure_base_url}__size__${poster.file_path}`;
          saveToCache(id, type, language, url);
          setImgPreview(
            url.replace('__size__', config.images.profile_sizes[1]),
          );
          setImgUrl(
            url.replace('__size__', config.images.profile_sizes[imgArrSize]),
          );
          return;
        } else {
          setMessage(`Image not found`);
        }
      })
      .catch(() => {
        setMessage(`Not found in TMDB`);
      });
  }, [config, inview, language, id, type, size]);

  return { imgUrl, imgPreview, message };
};