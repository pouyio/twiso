import React, { useContext, useMemo } from 'react';
import { useInView } from 'react-hook-inview';
import Emoji from './Emoji';
import { useImage } from '../hooks/useImage';
import { Img } from '../lib/react-image/Img';
import { Ids } from '../models/Ids';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { USER_MOVIES_TABLE, USER_SHOWS_TABLE } from '../utils/db';
import { AuthContext } from '../contexts/AuthContext';

interface IImageProps {
  ids: Ids;
  text: string;
  type: 'movie' | 'show' | 'person';
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'big';
  forceState?: 'watched' | 'watchlist';
  hidden?: boolean;
  dimmed?: boolean;
}

const Image: React.FC<React.PropsWithChildren<IImageProps>> = ({
  ids,
  text,
  type,
  className = '',
  style = {},
  size = 'small',
  forceState,
  hidden = false,
  dimmed = false,
  ...props
}) => {
  const { session } = useContext(AuthContext);
  const [ref, inView] = useInView({ unobserveOnEnter: true });

  const { imgUrl, imgPreview, message } = useImage(
    ids.tmdb,
    type,
    size,
    inView
  );

  const liveItem = useLiveQuery(() => {
    if (!ids.tmdb || !['movie', 'show'].includes(type) || forceState) {
      return null;
    }
    const table = type === 'movie' ? USER_MOVIES_TABLE : USER_SHOWS_TABLE;
    return db.table(table).get(ids.tmdb);
  }, [ids, forceState]);

  const status = forceState ? forceState : liveItem?.status;

  const borderClass = useMemo(() => {
    if (!session) return '';
    if (type === 'person') return '';
    if (hidden) {
      return 'brightness-70 opacity-50';
    }
    if (status === 'watched') {
      return 'outline-green-400';
    }
    if (status === 'watchlist') {
      return 'outline-blue-400';
    }
    return 'outline-transparent';
  }, [status]);

  return (
    <div
      ref={ref}
      style={style}
      {...props}
      className={
        className +
        ` ${
          size === 'big' ? 'min-h-116' : 'min-h-53'
        } ${dimmed ? 'opacity-50' : ''} h-full bg-transparent flex justify-center items-center rounded-lg overflow-hidden transition-colors duration-300 outline-2 ` +
        borderClass
      }
    >
      <Img
        src={imgUrl}
        className="m-auto md:max-w-md h-full rounded-lg"
        alt={text}
        unloader={
          <h1 className="justify-center items-center p-2 text-center">
            {text}
            <br />
            {message}
          </h1>
        }
        loader={
          <Img
            className="m-auto md:max-w-md h-full rounded-lg"
            style={{ filter: 'blur(5px)' }}
            src={imgPreview}
            alt={text}
            loader={
              <h1 className="justify-center items-center p-2 text-center">
                {text}
                <br />
                {message || (
                  <Emoji
                    className="ml-3 inline-block"
                    emoji="⏳"
                    rotating={true}
                  />
                )}
              </h1>
            }
          />
        }
      />
    </div>
  );
};

export default Image;
