import { PropsWithChildren, useEffect, useRef } from 'react';
import { matchPath, useLocation, useParams } from 'react-router';

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
  const localRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const id = matchPath('/:section/:id', location.pathname)?.params.id;

  useEffect(() => {
    localRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  return (
    <div ref={localRef} id="content" className="overflow-x-hidden">
      {children}
    </div>
  );
};

export const Layout = {
  Navbar,
  Content,
  Root,
};
