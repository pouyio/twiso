import React from 'react';
import { Link as RouterLink } from 'react-router';
import Image from '../Image';
import { Ids } from '../../models/Ids';

interface IImageListLinkProps {
  ids: Ids;
  text: string;
  type: 'movie' | 'show' | 'person';
  className?: string;
  tabIndex?: number;
  children?: React.ReactNode;
  forceState?: 'watched' | 'watchlist';
  hidden?: boolean;
  dimmed?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const ImageListLink: React.FC<IImageListLinkProps> = ({
  ids,
  text,
  type,
  className = '',
  tabIndex,
  children,
  forceState,
  hidden,
  dimmed,
  onClick,
}) => (
  <li className="w-35 shrink-0" tabIndex={tabIndex}>
    <RouterLink
      className={`block rounded-lg ${className}`}
      to={{
        pathname: `/${type}/${ids.tmdb}`,
      }}
      onClick={onClick}
    >
      <Image
        ids={ids}
        text={text}
        type={type}
        forceState={forceState}
        hidden={hidden}
        dimmed={dimmed}
      />
      {children}
    </RouterLink>
  </li>
);

export default ImageListLink;
