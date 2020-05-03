const withPWA = require('next-pwa');

const dev = process.env.NODE_ENV === 'development';

module.exports = withPWA({
  pwa: {
    disable: dev,
    dest: 'public',
  },
  env: {
    REACT_APP_TRAKT_API_KEY: process.env.REACT_APP_TRAKT_API_KEY,
    REACT_APP_TMDB_API_KEY: process.env.REACT_APP_TMDB_API_KEY,
    REACT_APP_REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL,
  },
});
