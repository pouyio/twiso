import React from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import initReactFastclick from 'react-fastclick';
import * as Sentry from '@sentry/browser';
import packageInfo from '../package.json';
import { setSWRegistration } from 'state/slices/root';
import { store } from 'state/store';
import { Provider } from 'react-redux';
import 'scroll-behavior-polyfill';
import { Integrations } from '@sentry/tracing';

initReactFastclick();

Sentry.init({
  release: `twiso@${packageInfo.version}`,
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (reg: ServiceWorkerRegistration) =>
    store.dispatch(setSWRegistration(reg)),
});
