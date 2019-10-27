import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

interface IImageLinkProps {
  item: any;
  style: React.CSSProperties;
  type: 'movie' | 'show' | 'person';
  children?: any;
}

const ImageLink: React.FC<IImageLinkProps> = ({
  item,
  style,
  type,
  children = '',
}) => {
  return (
    <Link
      to={{
        pathname: `/${type}/${item[type].ids.trakt}`,
        search: `?slug=${item[type].ids.slug}`,
        state: item,
      }}
    >
      <Image item={item} style={style} type={type} />
      {children}
    </Link>
  );
};

export default ImageLink;
