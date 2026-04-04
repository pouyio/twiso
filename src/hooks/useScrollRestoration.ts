import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

type ScrollDirection = 'vertical' | 'horizontal';

export const useScrollRestoration = (
  containerRef: React.RefObject<HTMLElement | null> | null,
  direction: ScrollDirection = 'vertical',
  identifier?: string
) => {
  const location = useLocation();
  const scrollRestored = useRef(false);
  const maxRetries = useRef(0);
  const key = `scroll_${location.pathname}${location.search}${
    identifier ? `_${identifier}` : ''
  }`;

  useEffect(() => {
    scrollRestored.current = false;
    maxRetries.current = 0;
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!containerRef) return;

    const checkAndRestore = () => {
      const container = containerRef.current;
      if (!container) return;

      const isVertical = direction === 'vertical';
      const storageKey = isVertical ? `${key}_top` : `${key}_left`;
      const saved = sessionStorage.getItem(storageKey);

      if (!saved) return;

      const scrollValue = parseInt(saved, 10);
      const isScrollable = isVertical
        ? container.scrollHeight > container.clientHeight
        : container.scrollWidth > container.clientWidth;

      if (isScrollable) {
        if (isVertical) {
          container.scrollTop = scrollValue;
        } else {
          container.scrollLeft = scrollValue;
        }
        scrollRestored.current = true;
      }
    };

    const tryRestore = () => {
      const container = containerRef.current;
      if (!container) {
        if (maxRetries.current < 20) {
          maxRetries.current++;
          setTimeout(tryRestore, 100);
        }
        return;
      }

      const isVertical = direction === 'vertical';
      const isScrollable = isVertical
        ? container.scrollHeight > container.clientHeight
        : container.scrollWidth > container.clientWidth;

      if (isScrollable) {
        checkAndRestore();
      } else {
        if (maxRetries.current < 20) {
          maxRetries.current++;
          setTimeout(tryRestore, 100);
        }
      }
    };

    tryRestore();
  }, [key, containerRef, direction]);

  useEffect(() => {
    if (!containerRef) return;

    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const isVertical = direction === 'vertical';
        const storageKey = isVertical ? `${key}_top` : `${key}_left`;
        const scrollValue = isVertical
          ? Math.round(container.scrollTop)
          : Math.round(container.scrollLeft);
        sessionStorage.setItem(storageKey, scrollValue.toString());
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [key, containerRef, direction]);
};
