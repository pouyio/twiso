import React, { useEffect, useState } from 'react';
import ImageLink from './ImageLink';
import { getPopularApi } from '../utils/api';
import Emoji from './Emoji';
import { Popular as IPopular } from '../models/Popular';
import { useTranslate } from '../hooks/useTranslate';

interface IPopularProps {
  type: 'movie' | 'show';
}

const Popular: React.FC<IPopularProps> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IPopular[]>([]);
  const { t } = useTranslate();

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    getPopularApi(type).then(({ data }) => {
      if (isSubscribed) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [type]);

  return (
    <>
      <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
        <Emoji emoji={loading ? '⏳' : '⭐'} rotating={loading} />
        <span className="mx-2">{t(`popular_${type}`)}</span>
      </h1>
      <ul
        className="-mx-4 -mt-2 flex flex-col flex-wrap content-start overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}
      >
        {results.map((r) => (
          <li
            key={r[type]!.ids.trakt}
            className="p-2"
            style={{ height: '13.5em', width: '9.5em' }}
          >
            <ImageLink
              ids={(r.show || r.movie)!.ids}
              text={(r.show || r.movie)!.title}
              style={{ minHeight: '10em' }}
              type={type}
            />
          </li>
        ))}
      </ul>
      <div className="h-1 border-b-2 rounded-full my-8"></div>
    </>
  );
};

export default Popular;
