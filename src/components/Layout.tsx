import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

interface HeaderSlotContextValue {
  slot: HTMLElement | null;
  setSlot: (node: HTMLElement | null) => void;
}

const HeaderSlotContext = createContext<HeaderSlotContextValue>({
  slot: null,
  setSlot: () => {},
});

const Root: React.FC<PropsWithChildren> = ({ children }) => {
  const [slot, setSlotState] = useState<HTMLElement | null>(null);
  const setSlot = useCallback((node: HTMLElement | null) => {
    setSlotState(node);
  }, []);
  const value = useMemo(() => ({ slot, setSlot }), [slot, setSlot]);

  return (
    <HeaderSlotContext value={value}>
      <div id="app-shell">{children}</div>
    </HeaderSlotContext>
  );
};

const SafeAreaTop: React.FC = () => <div id="safe-top" aria-hidden="true" />;

const Navbar: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav id="navbar" className="relative z-20 w-full select-none bg-gray-200">
      {children}
    </nav>
  );
};

interface ViewProps extends PropsWithChildren {
  overlay?: ReactNode;
}

const View: React.FC<ViewProps> = ({ children, overlay }) => {
  const { setSlot } = useContext(HeaderSlotContext);

  return (
    <div id="view">
      <div id="page-header" ref={setSlot} className="safe-x" />
      {children}
      {overlay}
    </div>
  );
};

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollRestoration(ref);

  return (
    <div id="content" ref={ref} className="safe-x">
      {children}
    </div>
  );
};

const PageHeader: React.FC<PropsWithChildren> = ({ children }) => {
  const { slot } = useContext(HeaderSlotContext);

  if (!slot) return null;

  return createPortal(children, slot);
};

const Overlay: React.FC<PropsWithChildren> = ({ children }) => (
  <div
    id="overlay"
    className="absolute inset-x-0 top-0 z-30 flex max-h-full flex-col"
  >
    {children}
  </div>
);

export const Layout = {
  Content,
  Navbar,
  Overlay,
  PageHeader,
  Root,
  SafeAreaTop,
  View,
};
