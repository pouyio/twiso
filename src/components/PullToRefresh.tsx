import { PropsWithChildren } from 'react';
import { Icon } from './Icon';
import { PULL_LIMIT, usePullToRefresh } from 'hooks/usePullToRefresh';

export const PullToRefresh: React.FC<
  PropsWithChildren<{ callback: () => void }>
> = ({ children, callback }) => {
  const { pullChange } = usePullToRefresh({ cb: callback });
  return (
    <div style={{ marginTop: pullChange }}>
      <div className="p-2 rounded-full flex flex-col justify-center items-center -mt-10">
        <Icon
          name="refresh"
          className="h-6"
          style={{
            transform: `rotate(-${
              pullChange <= PULL_LIMIT ? pullChange * 2 : 0
            }deg) scale(${(pullChange + 50) * 1.5}%)`,
            translate: `0% -${pullChange * 1.3}%`,
          }}
        />
      </div>
      {children}
    </div>
  );
};
