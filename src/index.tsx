import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';
import { createRoot } from 'react-dom/client';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import 'scroll-behavior-polyfill';
import { store } from 'state/store';
import packageInfo from '../package.json';
import './index.scss';
import { Main } from './main';
import './tailwind.css';

initReactFastclick();

Sentry.init({
  release: `twiso@${packageInfo.version}`,
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
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
