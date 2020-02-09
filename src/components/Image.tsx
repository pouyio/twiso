import React from 'react';
import { useInView } from 'react-hook-inview';
import Emoji from './Emoji';
import { Ids } from '../models';
import useIsWatch from '../utils/useIsWatch';
import Helmet from 'react-helmet';
import { useImage } from 'utils/hooks/useImage';
import Img from 'react-image';

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
  const { isWatchlist, isWatched } = useIsWatch();
  const [ref, inView] = useInView({ unobserveOnEnter: true });

  const { imgUrl, imgPreview, message } = useImage(
    ids.tmdb,
    type,
    size,
    inView,
  );

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
      <Helmet>
        <meta property="og:image" content={imgUrl} />
      </Helmet>
      <Img
        src={imgUrl}
        className="m-auto md:max-w-md h-full rounded-lg"
        alt={text}
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
    </div>
  );
};

export default Image;
