import { PropsWithChildren } from 'react';
import { Icon } from './Icon';
import { usePullToRefresh } from 'hooks/usePullToRefresh';

export const PullToRefresh: React.FC<
  PropsWithChildren<{ callback: () => void }>
> = ({ children, callback }) => {
  const { pullChange, limitReached } = usePullToRefresh({ cb: callback });
  return (
    <div style={{ marginTop: pullChange }}>
      <div className="p-2 rounded-full flex flex-col justify-center items-center -mt-10">
        <Icon
          name="refresh"
          className={`h-6 ${limitReached ? 'animate-spin scale-[2.6]' : ``}`}
          style={{
            ...(!limitReached
              ? { transform: `scale(${(pullChange + 50) * 1.5}%)` }
              : {}),
            translate: `0% -1.2rem`,
          }}
        />
      </div>
      {children}
    </div>
  );
};
