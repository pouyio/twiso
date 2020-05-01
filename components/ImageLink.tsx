import React from 'react';

import Image from './Image';
import { Movie, Show, Person, Ids } from '../models';
import Link from 'next/link';

interface IImageLinkProps {
  item: Show | Movie | Person;
  ids: Ids;
  text: string;
  style?: React.CSSProperties;
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
      passHref
      href={{
        pathname: `/${type}/[id]`,
        query: { slug: ids.slug, data: JSON.stringify(item) },
      }}
      as={{
        pathname: `/${type}/${ids.trakt}`,
        query: { slug: ids.slug, data: JSON.stringify(item) },
      }}
    >
      <a>
        <Image ids={ids} text={text} style={style} type={type} />
        {children}
      </a>
    </Link>
  );
};

export default ImageLink;
