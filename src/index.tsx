import React from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';
import './index.scss';
import App from './App';
import initReactFastclick from 'react-fastclick';
import * as Sentry from '@sentry/react';
import packageInfo from '../package.json';
import { store } from 'state/store';
import { Provider } from 'react-redux';
import 'scroll-behavior-polyfill';
import { BrowserTracing } from '@sentry/tracing';

initReactFastclick();

Sentry.init({
  release: `twiso@${packageInfo.version}`,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
