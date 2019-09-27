const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.js'),
    process.env.NODE_ENV === 'production' &&
      purgecss({
        content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.tsx'],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
  ],
};
