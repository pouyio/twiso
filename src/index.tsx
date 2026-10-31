import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './state/store';
import packageInfo from '../package.json';
import './index.css';
import { Main } from './main';

// iOS standalone apps can report a 0 top safe-area inset. Tag the document so
// the shell can keep a solid status-bar strip for Safari's tint sampling.
if ((window.navigator as Navigator & { standalone?: boolean }).standalone) {
  document.documentElement.classList.add('ios-standalone');
}

Sentry.init({
  release: `twiso@${packageInfo.version}`,
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
  </React.StrictMode>
);
