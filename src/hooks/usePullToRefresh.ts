import { useEffect, useState } from 'react';

export const PULL_LIMIT = 360;

const K = 0.5;

const appr = (x: number) => {
  return PULL_LIMIT * (1 - Math.exp((-K * x) / PULL_LIMIT));
};

export const usePullToRefresh = ({ cb }: { cb: () => void }) => {
  const [startPoint, setStartPoint] = useState(0);
  const [pullChange, setPullChange] = useState<number>(0);

  const pull = (e: TouchEvent) => {
    let lastStartPoint = startPoint || 0;
    if (document.documentElement.scrollTop === 0 && startPoint === 0) {
      const { screenY } = e.targetTouches[0];
      lastStartPoint = screenY;
      setStartPoint(screenY);
    }
    if (document.documentElement.scrollTop !== 0) {
      return;
    }
    const { screenY } = e.targetTouches[0];
    let pullLength =
      lastStartPoint <= screenY ? Math.abs(screenY - lastStartPoint) : 0;
    pullLength = pullLength < PULL_LIMIT ? pullLength : PULL_LIMIT;
    setPullChange(appr(pullLength));
  };

  const endPull = () => {
    if (pullChange >= PULL_LIMIT) cb();
    setStartPoint(0);
    setPullChange(0);
  };

  useEffect(() => {
    window.addEventListener('touchmove', pull);
    window.addEventListener('touchend', endPull);
    return () => {
      window.removeEventListener('touchmove', pull);
      window.removeEventListener('touchend', endPull);
    };
  });

  return { pullChange };
};
