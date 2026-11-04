import React from 'react';
import { Link } from 'react-router';
import Image from './Image';
import { Ids } from '../models/Ids';

interface IImageLinkProps {
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

const ImageLink: React.FC<IImageLinkProps> = ({
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
}) => {
  return (
    <li className="w-35 shrink-0" tabIndex={tabIndex}>
      <Link
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
      </Link>
    </li>
  );
};

export default ImageLink;
