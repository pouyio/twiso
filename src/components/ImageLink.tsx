import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { Movie, Show, Person, Ids } from '../models';

interface IImageLinkProps {
  item: Show | Movie | Person;
  ids: Ids;
  text: string;
  style?: React.CSSProperties;
  type: 'movie' | 'show' | 'person';
  status?: 'watched' | 'watchlist';
}

const ImageLink: React.FC<IImageLinkProps> = ({
  item,
  ids,
  text,
  style,
  type,
  status,
  children = '',
}) => {
  return (
    <Link
      to={{
        pathname: `/${type}/${ids.trakt}`,
        state: item,
      }}
    >
      <Image ids={ids} text={text} style={style} type={type} status={status} />
      {children}
    </Link>
  );
};

export default ImageLink;
