import { a as imagePromiseFactory, b as useImage } from './useImage';
import React, { forwardRef, ReactNode, Ref } from 'react';

const defaultPassthrough = (el: ReactNode): ReactNode => el;

interface ImgProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  decode?: boolean;
  src: string | string[];
  loader?: ReactNode | null;
  unloader?: ReactNode | null;
  container?: (children: ReactNode) => ReactNode;
  loaderContainer?: (children: ReactNode) => ReactNode;
  unloaderContainer?: (children: ReactNode) => ReactNode;
  imgPromise?: (src: string) => Promise<void>;
  crossorigin?: string;
  useSuspense?: boolean;
}

function ImgComponent(
  {
    decode = true,
    src = [],
    loader = null,
    unloader = null,
    container = defaultPassthrough,
    loaderContainer = defaultPassthrough,
    unloaderContainer = defaultPassthrough,
    imgPromise,
    crossorigin,
    useSuspense = false,
    ...imgProps
  }: ImgProps,
  ref: Ref<HTMLImageElement>
) {
  const imgPromiseFactory =
    imgPromise || imagePromiseFactory({ decode, crossOrigin: crossorigin });

  const { src: loadedSrc, isLoading } = useImage({
    srcList: src,
    imgPromise: imgPromiseFactory,
    useSuspense,
  });

  return loadedSrc
    ? container(
        React.createElement('img', { src: loadedSrc, ...imgProps, ref })
      )
    : !useSuspense && isLoading
    ? loaderContainer(loader)
    : !useSuspense && unloader
    ? unloaderContainer(unloader)
    : null;
}

export const Img = forwardRef(ImgComponent) as React.ForwardRefExoticComponent<
  Omit<ImgProps, 'ref'> & React.RefAttributes<HTMLImageElement>
>;
