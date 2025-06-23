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
  forceState?: 'watched' | 'watchlist';
  hidden?: boolean;
}

const ImageLink: React.FC<React.PropsWithChildren<IImageLinkProps>> = ({
  ids,
  text,
  style,
  type,
  forceState,
  hidden,
  children = '',
  onClick = () => {},
}) => {
  const url = new URL(ids.imdb, 'http://example.com');

  return (
    <Link
      to={{
        pathname: `/${type}/${url.pathname.replaceAll('/', '')}`,
      }}
      onClick={onClick}
    >
      <Image
        ids={ids}
        text={text}
        style={style}
        type={type}
        forceState={forceState}
        hidden={hidden}
      />
      {children}
    </Link>
  );
};

export default ImageLink;
