import { useEffect, useRef } from 'react';
import { DEFAULT_PAGE_BACKGROUND } from '../utils/pageBackground';

let activeToken: symbol | null = null;

/**
 * Paints the app shell with a page-specific background. The cleanup is guarded
 * by a per-mount token so an outgoing page cannot reset the background of the
 * page that replaced it.
 */
export const usePageBackground = (color: string = DEFAULT_PAGE_BACKGROUND) => {
  const token = useRef<symbol | null>(null);
  if (!token.current) {
    token.current = Symbol('page-background');
  }

  useEffect(() => {
    const shell = document.getElementById('app-shell');
    const currentToken = token.current;
    activeToken = currentToken;
    shell?.style.setProperty('--page-bg', color);

    return () => {
      if (activeToken !== currentToken) return;
      activeToken = null;
      shell?.style.removeProperty('--page-bg');
    };
  }, [color]);
};
