import React, { JSX } from 'react';
import { useImageProps } from './useImage';
export type ImgProps = Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'> & Omit<useImageProps, 'srcList'> & {
    src: useImageProps['srcList'];
    loader?: JSX.Element | null;
    unloader?: JSX.Element | null;
    decode?: boolean;
    crossorigin?: string;
    container?: (children: React.ReactNode) => JSX.Element;
    loaderContainer?: (children: React.ReactNode) => JSX.Element;
    unloaderContainer?: (children: React.ReactNode) => JSX.Element;
};
declare const _default: React.ForwardRefExoticComponent<Omit<ImgProps, "ref"> & React.RefAttributes<HTMLImageElement>>;
export default _default;
