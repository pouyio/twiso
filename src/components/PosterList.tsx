import React from 'react';

type PosterListLayout = 'horizontal' | 'columns' | 'grid' | 'custom';

interface IPosterListProps {
  children?: React.ReactNode;
  className?: string;
  layout?: PosterListLayout;
  loadingCount?: number;
  listRef?: React.Ref<HTMLUListElement>;
  style?: React.CSSProperties;
}

const layoutClasses: Record<PosterListLayout, string> = {
  horizontal:
    'flex overflow-x-auto -mx-4 my-2 p-1 gap-4 lg:mx-0 lg:overflow-auto lg:flex-wrap',
  columns:
    '-mx-4 p-1 flex flex-col flex-wrap content-start overflow-x-auto gap-4 max-h-120',
  grid: 'flex flex-wrap py-4 px-2 items-stretch justify-center select-none gap-4',
  custom: '',
};

const PosterList: React.FC<IPosterListProps> = ({
  children,
  className = '',
  layout = 'horizontal',
  loadingCount = 0,
  listRef,
  style,
}) => (
  <ul
    ref={listRef}
    className={`${layoutClasses[layout]} ${className}`}
    style={style}
  >
    {Array.from({ length: loadingCount }, (_, index) => (
      <li
        key={`poster-placeholder-${index}`}
        className="w-35 min-h-53 shrink-0 bg-gray-200 rounded-lg from-gray-300 bg-linear-to-r animate-pulse"
      />
    ))}
    {children}
  </ul>
);

export default PosterList;
