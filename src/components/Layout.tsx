import { PropsWithChildren, useRef } from 'react';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

const Root: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      id="root-grid"
      className="grid h-full grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_auto_1fr]"
    >
      <div id="top-bar-slot" className="order-[-1] lg:order-[2]" />
      {children}
    </div>
  );
};

const Navbar: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav
      id="navbar"
      className="w-full sticky bottom-0 lg:top-0 z-20 select-none order-1 lg:order-1"
    >
      {children}
    </nav>
  );
};

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollRestoration(ref);
  return (
    <div
      id="content"
      ref={ref}
      className="overflow-x-auto max-w-dvw pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] order-0 lg:order-3"
    >
      {children}
    </div>
  );
};

export const Layout = {
  Navbar,
  Content,
  Root,
};
