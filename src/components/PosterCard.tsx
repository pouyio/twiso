import React from 'react';
import ImageLink from './ImageLink';
import { Ids } from '../models/Ids';

interface IPosterCardProps {
  ids: Ids;
  text: string;
  type: 'movie' | 'show' | 'person';
  caption?: React.ReactNode;
  captionClassName?: string;
  className?: string;
  tabIndex?: number;
  forceState?: 'watched' | 'watchlist';
  hidden?: boolean;
  dimmed?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const PosterCard: React.FC<IPosterCardProps> = ({
  ids,
  text,
  type,
  caption,
  captionClassName = 'text-sm text-center py-1',
  className = '',
  tabIndex,
  forceState,
  hidden,
  dimmed,
  onClick,
}) => (
  <li className="w-35 shrink-0" tabIndex={tabIndex}>
    <div className={`rounded-lg ${className}`}>
      <ImageLink
        ids={ids}
        text={text}
        type={type}
        forceState={forceState}
        hidden={hidden}
        dimmed={dimmed}
        onClick={onClick}
      >
        {caption && <p className={captionClassName}>{caption}</p>}
      </ImageLink>
    </div>
  </li>
);

export default PosterCard;
