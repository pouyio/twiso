import { PropsWithChildren, useRef } from 'react';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

const Root: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      id="root-grid"
      className="grid h-full grid-rows-[1fr_auto] lg:grid-rows-[auto_1fr]"
    >
      {children}
    </div>
  );
};

const Navbar: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav
      id="navbar"
      className="w-full sticky bottom-0 lg:top-0 z-20 select-none order-1 lg:order-none"
    >
      {children}
    </nav>
  );
};

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollRestoration(ref);
  return (
    <div id="content" className="overflow-x-hidden" ref={ref}>
      {children}
    </div>
  );
};

export const Layout = {
  Navbar,
  Content,
  Root,
};
