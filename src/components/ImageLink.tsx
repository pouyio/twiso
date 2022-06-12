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
}

const ImageLink: React.FC<React.PropsWithChildren<IImageLinkProps>> = ({
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
      }}
      state={item}
    >
      <Image ids={ids} text={text} style={style} type={type} />
      {children}
    </Link>
  );
};

export default ImageLink;
