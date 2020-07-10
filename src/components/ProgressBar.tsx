import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IState } from 'state/state';

export const ProgressBar: React.FC = () => {
  const [width, setWith] = useState<number>();
  const current = useSelector((state: IState) => state.loading.shows.current);
  const total = useSelector((state: IState) => state.loading.shows.total);

  useEffect(() => {
    if (!total) {
      setWith(undefined);
      return;
    }
    if (total && current !== total) {
      setWith((current * 100) / total);
      return;
    }

    setWith(undefined);
  }, [current, total]);

  return width ? (
    <div
      style={{ width: `${width}%`, transition: 'width 0.5s ease' }}
      className="h-1 bg-gray-600 rounded-r-full lg:order-last"
    ></div>
  ) : (
    <></>
  );
};
