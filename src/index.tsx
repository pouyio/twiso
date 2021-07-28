import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.css';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import initReactFastclick from 'react-fastclick';
import * as Sentry from '@sentry/browser';
import { version } from '../package.json';
import { setSWRegistration } from 'state/slices/rootSlice';
import { store } from 'state/store';
import { Provider } from 'react-redux';
import 'scroll-behavior-polyfill';

initReactFastclick();

Sentry.init({
  release: `twiso@${version}`,
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (reg: ServiceWorkerRegistration) =>
    store.dispatch(setSWRegistration(reg)),
});
