import React from 'react';
import { Link } from 'react-router';
import Image from './Image';
import { Ids } from '../models/Ids';

interface IImageLinkProps {
  ids: Ids;
  text: string;
  style?: React.CSSProperties;
  type: 'movie' | 'show' | 'person';
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  forceState?: 'completed' | 'plantowatch' | 'watching';
}

const ImageLink: React.FC<React.PropsWithChildren<IImageLinkProps>> = ({
  ids,
  text,
  style,
  type,
  forceState,
  children = '',
  onClick = () => {},
}) => {
  return (
    <Link
      to={{
        pathname: `/${type}/${ids.imdb}`,
      }}
      onClick={onClick}
    >
      <Image
        ids={ids}
        text={text}
        style={style}
        type={type}
        forceState={forceState}
      />
      {children}
    </Link>
  );
};

export default ImageLink;
