const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
  env: {
    REACT_APP_TRAKT_API_KEY: process.env.REACT_APP_TRAKT_API_KEY,
    REACT_APP_TMDB_API_KEY: process.env.REACT_APP_TMDB_API_KEY,
    REACT_APP_REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL,
  },
});
