import { getImgsApi } from '../api';
import { getFromCache, saveToCache } from '../cache';
import { BaseImage } from '../../models';
import { useState, useEffect } from 'react';
import { useGlobalState } from 'state/store';

const findFirstValid = (images: BaseImage[], language: string) => {
  const p = images.find(p => p.iso_639_1 === language);
  return p || images[0];
};

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
