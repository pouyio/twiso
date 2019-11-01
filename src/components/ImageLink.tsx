import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { Movie, Show, IPerson, Ids } from '../models';

interface IImageLinkProps {
  item: Show | Movie | IPerson;
  ids: Ids;
  text: string;
  style: React.CSSProperties;
  type: 'movie' | 'show' | 'person';
}

const ImageLink: React.FC<IImageLinkProps> = ({
  item,
  ids,
  text,
  style,
  type,
  children = '',
}) => {
  return (
    <Link
      to={{
        pathname: `/${type}/${ids.trakt}`,
        search: `?slug=${ids.slug}`,
        state: item,
      }}
    >
      <Image ids={ids} text={text} style={style} type={type} />
      {children}
    </Link>
  );
};

export default ImageLink;
