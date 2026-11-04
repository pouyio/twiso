import React, { useEffect, useRef, useState } from 'react';
import ImageLink from './ImageLink';
import PosterList from './PosterList';
import { getPopularApi } from '../utils/api';
import Emoji from './Emoji';
import { Popular as IPopular } from '../models/Popular';
import { useTranslate } from '../hooks/useTranslate';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

interface IPopularProps {
  type: 'movie' | 'show';
}

const Popular: React.FC<IPopularProps> = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IPopular[]>([]);
  const { t } = useTranslate();
  const resultsScroll = useRef<HTMLUListElement>(null);
  useScrollRestoration(resultsScroll, 'horizontal', `popular_${type}`);

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    getPopularApi(type).then((data) => {
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
      <h1 className="text-2xl justify-center text-gray-700 m-4 flex items-baseline">
        <Emoji emoji={loading ? '⏳' : '⭐'} rotating={loading} />
        <span className="mx-2">{t(`popular_${type}`)}</span>
      </h1>
      <PosterList
        layout="columns"
        listRef={resultsScroll}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {results.map((r) => (
          <ImageLink
            key={r[type]!.ids.tmdb}
            ids={(r.show || r.movie)!.ids}
            text={(r.show || r.movie)!.title}
            type={type}
          />
        ))}
      </PosterList>
    </>
  );
};

export default Popular;
