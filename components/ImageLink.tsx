import { useRouter } from 'next/router';
import React from 'react';
import { Ids, Movie, Person, Show } from '../models';
import Image from './Image';

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
  const { push } = useRouter();

  const handleNavigation = () => {
    if (type !== 'person') {
      sessionStorage.setItem(`${type}_${ids.trakt}`, JSON.stringify(item));
    }
    push(
      {
        pathname: `/${type}/[id]`,
        query: { slug: ids.slug },
      },
      {
        pathname: `/${type}/${ids.trakt}`,
        query: { slug: ids.slug },
      },
    );
  };
  return (
    <a className="cursor-pointer" onClick={handleNavigation}>
      <Image ids={ids} text={text} style={style} type={type} />
      {children}
    </a>
  );
};

export default ImageLink;
