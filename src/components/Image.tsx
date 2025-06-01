import React, { useContext, useMemo } from 'react';
import { useInView } from 'react-hook-inview';
import Emoji from './Emoji';
import { useImage } from '../hooks/useImage';
import { Img } from '../lib/react-image'; // temporary load local lib until remote is updated https://github.com/mbrevda/react-image/pull/1006
import { Ids } from '../models/Ids';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { USER_MOVIES_TABLE, USER_SHOWS_TABLE } from 'utils/db';
import { AuthContext } from 'contexts/AuthContext';

interface IImageProps {
  ids?: Ids;
  text: string;
  type: 'movie' | 'show' | 'person';
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'big';
  forceState?: 'watched' | 'watchlist';
  hidden?: boolean;
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
  ...props
}) => {
  const { session } = useContext(AuthContext);
  const [ref, inView] = useInView({ unobserveOnEnter: true });

  const { imgUrl, imgPreview, message } = useImage(
    type,
    size,
    inView,
    ids?.tmdb
  );

  const liveItem = useLiveQuery(() => {
    if (!ids?.imdb || !['movie', 'show'].includes(type) || forceState) {
      return null;
    }
    const table = type === 'movie' ? USER_MOVIES_TABLE : USER_SHOWS_TABLE;
    return db.table(table).get(ids.imdb);
  }, [ids, forceState]);

  const status = forceState ? forceState : liveItem?.status;

  const borderClass = useMemo(() => {
    if (!session) return '';
    if (type === 'person') return '';
    if (hidden) {
      return 'border-2 brightness-70 opacity-50';
    }
    if (status === 'watched') {
      return 'border-2 border-green-400';
    }
    if (status === 'watchlist') {
      return 'border-2 border-blue-400';
    }
    return '';
  }, [status]);

  return (
    <div
      ref={ref}
      style={style}
      {...props}
      className={
        className +
        ' h-full bg-gray-300 flex justify-center items-center rounded-lg overflow-hidden ' +
        borderClass
      }
    >
      {(imgUrl || imgPreview) && (
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
                    <Emoji className="ml-3" emoji="⏳" rotating={true} />
                  )}
                </h1>
              }
            />
          }
        />
      )}
    </div>
  );
};

export default Image;
