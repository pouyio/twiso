import * as Sentry from '@sentry/react';
import App from 'App';
import { Providers } from 'components/Providers';
import { useState } from 'react';

export const Main = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>();
  return (
    <Sentry.ErrorBoundary>
      <div ref={setRef}>
        <Providers modalRef={ref!}>
          <App />
        </Providers>
      </div>
    </Sentry.ErrorBoundary>
  );
};
