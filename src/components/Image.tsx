import React, { useEffect, useState } from 'react';
import { useInView } from 'react-hook-inview';
import Emoji from './Emoji';
import getImgUrl from '../utils/extractImg';
import { Ids } from '../models';
import { useGlobalState } from '../state/store';
import useIsWatch from '../utils/useIsWatch';

interface IImageProps {
  ids: Ids;
  text: string;
  type: 'movie' | 'show' | 'person';
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'big';
}

const Image: React.FC<IImageProps> = ({
  ids,
  text,
  type,
  className = '',
  style = {},
  size = 'small',
  ...props
}) => {
  const [imgUrl, setImgUrl] = useState('');
  const [message, setMessage] = useState('');
  const { isWatchlist, isWatched } = useIsWatch();
  const {
    state: { language, config },
  } = useGlobalState();
  const [ref, inView] = useInView({ unobserveOnEnter: true });

  useEffect(() => {
    if (!config || !inView) {
      return;
    }

    getImgUrl(ids.tmdb, type, config, language, size)
      .then(url => setImgUrl(url))
      .catch(({ message }) => setMessage(message));
  }, [config, ids, language, inView, type, size]);

  const getBorderClass = () => {
    if (type === 'person') return '';
    if (isWatched(ids.trakt, type)) {
      return 'border-2 border-green-400';
    }
    if (isWatchlist(ids.trakt, type)) {
      return 'border-2 border-blue-400';
    }
    return '';
  };

  return (
    <div
      ref={ref}
      style={style}
      {...props}
      className={
        className +
        ' h-full bg-gray-300 flex justify-center items-center rounded-lg overflow-hidden ' +
        getBorderClass()
      }
    >
      {(!inView || !imgUrl) && (
        <h1 className="justify-center items-center p-2">
          {text}
          <br />
          {message || <Emoji className="ml-3" emoji="⏳" rotating={true} />}
        </h1>
      )}
      {inView && imgUrl && (
        <img className="m-auto md:max-w-md h-full" src={imgUrl} alt={text} />
      )}
    </div>
  );
};

export default Image;
