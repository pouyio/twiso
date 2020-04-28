import React from 'react';

import Image from './Image';
import { Movie, Show, Person, Ids } from '../models';
import Link from 'next/link';

interface IImageLinkProps {
  // TODO check if it can be removed, not used
  // https://spectrum.chat/next-js/general/how-to-get-react-router-location-state-feature-with-next-router~fc327910-21e1-42f7-8ebc-a960fe94ba31
  item: Show | Movie | Person;
  ids: Ids;
  text: string;
  style?: React.CSSProperties;
  type: 'movie' | 'show' | 'person';
}

const ImageLink: React.FC<IImageLinkProps> = ({
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
        search: `?slug=${ids.slug}`,
      }}
      as={`/${type}/${ids.trakt}?slug=${ids.slug}`}
    >
      <a>
        <Image ids={ids} text={text} style={style} type={type} />
        {children}
      </a>
    </Link>
  );
};

export default ImageLink;
