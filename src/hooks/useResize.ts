import { useState, useCallback, useLayoutEffect } from 'react';

function useCallbackRef<T>() {
  const [ref, setRef] = useState<T | null>(null);
  const fn = useCallback((node: T) => {
    setRef(node);
  }, []);
  return [ref, fn] as any;
}

export const useResize = () => {
  const [element, attachRef] = useCallbackRef<Element>();
  const [bounds, setBounds] = useState<{ width?: number; height?: number }>({});

  useLayoutEffect(() => {
    const observer = new ResizeObserver(
      ([entry]: ReadonlyArray<ResizeObserverEntry>) => {
        setBounds({
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        });
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return {
    bounds,
    ref: attachRef,
  };
};
