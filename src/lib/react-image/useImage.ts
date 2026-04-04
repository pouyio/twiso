import { useState } from 'react';

type ImagePromise = (src: string) => Promise<void>;

interface UseImageOptions {
  srcList: string | string[];
  imgPromise?: ImagePromise;
  useSuspense?: boolean;
}

interface UseImageResult {
  src: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

type CacheStatus = 'pending' | 'resolved' | 'rejected';

interface CacheEntry {
  promise: Promise<string>;
  cache: CacheStatus;
  src?: string;
  error: Error | null;
}

const imagePromiseFactory = ({
  decode = true,
  crossOrigin = '',
}: { decode?: boolean; crossOrigin?: string } = {}): ImagePromise => {
  return (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (crossOrigin) img.crossOrigin = crossOrigin;
      img.onload = () => {
        if (decode && img.decode) {
          img.decode().then(resolve).catch(reject);
        } else {
          resolve();
        }
      };
      img.onerror = reject;
      img.src = src;
    });
  };
};

const filterEmpty = (arr: string[]): string[] => arr.filter((s) => s);

const normalizeSrcList = (src: string | string[]): string[] =>
  Array.isArray(src) ? src : [src];

const imageCache: Record<string, CacheEntry> = {};

const tryLoadImage = (
  srcList: string[],
  imgPromise: ImagePromise
): Promise<string> => {
  let isLoaded = false;
  return new Promise<string>((resolve, reject) => {
    const trySrc = async (src: string): Promise<string> => {
      return imgPromise(src).then(() => {
        isLoaded = true;
        return src;
      });
    };

    const promises = srcList.map((src) => trySrc(src));

    let currentPromise = promises[0];
    for (let i = 1; i < promises.length; i++) {
      currentPromise = currentPromise.catch(() => {
        if (!isLoaded) return promises[i];
        throw new Error('Already loaded');
      });
    }

    currentPromise
      .then((src) => {
        isLoaded = true;
        resolve(src);
      })
      .catch(reject);
  });
};

function useImage({
  srcList,
  imgPromise,
  useSuspense = true,
}: UseImageOptions): UseImageResult {
  const [, setState] = useState(0);
  const filteredSrcList = filterEmpty(normalizeSrcList(srcList));
  const cacheKey = filteredSrcList.join('');

  const triggerRender = () => setState((c) => c + 1);

  if (imageCache[cacheKey]) {
    const cached = imageCache[cacheKey];

    if (cached.cache === 'resolved') {
      return { src: cached.src, isLoading: false, error: null };
    }

    if (cached.cache === 'rejected') {
      if (useSuspense) throw cached.error;
      return { isLoading: false, error: cached.error, src: undefined };
    }

    cached.promise
      .then((src) => {
        imageCache[cacheKey] = { ...cached, cache: 'resolved', src };
        if (!useSuspense) triggerRender();
      })
      .catch((error) => {
        imageCache[cacheKey] = { ...cached, cache: 'rejected', error };
        if (!useSuspense) triggerRender();
      });

    if (useSuspense) {
      throw cached.promise;
    }

    return { isLoading: true, src: undefined, error: null };
  }

  const promiseFactory = imgPromise || imagePromiseFactory({ decode: true });

  imageCache[cacheKey] = {
    promise: tryLoadImage(filteredSrcList, promiseFactory),
    cache: 'pending',
    error: null,
  };

  imageCache[cacheKey].promise
    .then((src) => {
      imageCache[cacheKey] = {
        ...imageCache[cacheKey],
        cache: 'resolved',
        src,
      };
      if (!useSuspense) triggerRender();
    })
    .catch((error) => {
      imageCache[cacheKey] = {
        ...imageCache[cacheKey],
        cache: 'rejected',
        error,
      };
      if (!useSuspense) triggerRender();
      if (useSuspense) throw error;
    });

  const cached = imageCache[cacheKey];

  if (cached.cache === 'resolved') {
    return { src: cached.src, isLoading: false, error: null };
  }

  if (cached.cache === 'rejected') {
    if (useSuspense) throw cached.error;
    return { isLoading: false, error: cached.error, src: undefined };
  }

  if (useSuspense) throw cached.promise;

  return { isLoading: true, src: undefined, error: null };
}

export { imagePromiseFactory as a, useImage as b, useImage as default };
