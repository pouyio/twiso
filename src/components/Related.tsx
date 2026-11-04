import React, { useEffect, useRef, useState } from 'react';
import { getRelatedApi } from '../utils/api';
import PosterCard from './PosterCard';
import PosterList from './PosterList';
import { Empty } from './Empty';
import { Show } from '../models/Show';
import { Movie } from '../models/Movie';
import { Ids } from '../models/Ids';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

interface IRelatedProps {
  itemIds: Ids;
  type: 'movie' | 'show';
}

const Related: React.FC<IRelatedProps> = ({ itemIds, type }) => {
  const [results, setResults] = useState<(Show | Movie)[]>();
  const resultsRef = useRef<HTMLUListElement>(null);
  useScrollRestoration(resultsRef, 'horizontal');

  useEffect(() => {
    setResults(undefined);
    getRelatedApi<Show | Movie>(type, itemIds.tmdb).then((data) => {
      setResults(data);
    });
  }, [itemIds, type]);

  return (
    <PosterList
      listRef={resultsRef}
      className="justify-between"
      style={{ WebkitOverflowScrolling: 'touch' }}
      loadingCount={results ? 0 : 10}
    >
      {results ? (
        results.length ? (
          results.map((r) => (
            <PosterCard
              key={r.ids.tmdb}
              text={r.title}
              ids={r.ids}
              type={type}
            />
          ))
        ) : (
          <Empty />
        )
      ) : null}
    </PosterList>
  );
};

export default Related;
