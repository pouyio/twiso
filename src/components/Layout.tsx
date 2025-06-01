import { PropsWithChildren } from 'react';

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

const Content: React.FC<
  PropsWithChildren<{ ref: React.Ref<HTMLDivElement> }>
> = ({ children, ref }) => {
  return (
    <div ref={ref} id="content" className="overflow-x-hidden">
      {children}
    </div>
  );
};

export const Layout = {
  Navbar,
  Content,
  Root,
};
