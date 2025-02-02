import ArrowLeft from 'assets/round-alt-arrow-left-svgrepo-com.svg?react';
import ArrowRight from 'assets/round-alt-arrow-right-svgrepo-com.svg?react';
import DoubleArrowLeft from 'assets/round-double-alt-arrow-left-svgrepo-com.svg?react';
import DoubleArrowRight from 'assets/round-double-alt-arrow-right-svgrepo-com.svg?react';
import Tags from 'assets/tag-svgrepo-com.svg?react';
import Movie from 'assets/clapperboard-open-play-svgrepo-com.svg?react';
import TV from 'assets/tv-svgrepo-com.svg?react';
import Calendar from 'assets/calendar-svgrepo-com.svg?react';
import Search from 'assets/magnifer-svgrepo-com.svg?react';
import Profile from 'assets/user-svgrepo-com.svg?react';
import Clock from 'assets/alarm-svgrepo-com.svg?react';
import Archive from 'assets/archive-check-svgrepo-com.svg?react';
import Trailer from 'assets/video-frame-play-vertical-svgrepo-com.svg?react';
import Share from 'assets/share-svgrepo-com.svg?react';
import Like from 'assets/like-svgrepo-com.svg?react';
import Play from 'assets/play-circle-svgrepo-com.svg?react';
import Logout from 'assets/logout-2-svgrepo-com.svg?react';
import Ufo from 'assets/ufo-3-svgrepo-com.svg?react';
import Hidden from 'assets/eye-svgrepo-com.svg?react';
import NoHidden from 'assets/eye-disable-svgrepo-com.svg?react';
import { ThemeContext } from 'contexts/ThemeContext';
import React, { HTMLProps, useContext } from 'react';

const iconsMap = {
  'arrow-left': <ArrowLeft />,
  'arrow-right': <ArrowRight />,
  'double-arrow-left': <DoubleArrowLeft />,
  'double-arrow-right': <DoubleArrowRight />,
  tags: <Tags />,
  tv: <TV />,
  movie: <Movie />,
  calendar: <Calendar />,
  search: <Search />,
  profile: <Profile />,
  clock: <Clock />,
  archive: <Archive />,
  trailer: <Trailer />,
  share: <Share />,
  like: <Like />,
  play: <Play />,
  logout: <Logout />,
  ufo: <Ufo />,
  hidden: <Hidden />,
  'no-hidden': <NoHidden />,
} as const;

interface IconProps extends HTMLProps<HTMLDivElement> {
  name: keyof typeof iconsMap;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      {...props}
      className={
        className +
        (!theme || theme === 'theme-dark' ? ' invert hue-rotate-180' : '')
      }
      role="image"
    >
      {iconsMap[name]}
    </div>
  );
};
