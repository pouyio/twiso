import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Nunito', 'sans-serif'],
    },
    colors: {
      white: 'var(--primary-light)',
      black: 'var(--primary-dark)',

      gray: {
        100: 'var(--gray-100)',
        200: 'var(--gray-200)',
        300: 'var(--gray-300)',
        400: 'var(--gray-400)',
        500: 'var(--gray-500)',
        600: 'var(--gray-600)',
        700: 'var(--gray-700)',
        800: 'var(--gray-800)',
        900: 'var(--gray-900)',
      },
      green: {
        100: 'var(--green-100)',
        200: 'var(--green-200)',
        300: 'var(--green-300)',
        400: 'var(--green-400)',
        500: 'var(--green-500)',
        600: 'var(--green-600)',
        700: 'var(--green-700)',
        800: 'var(--green-800)',
        900: 'var(--green-900)',
      },
      blue: {
        100: 'var(--blue-100)',
        200: 'var(--blue-200)',
        300: 'var(--blue-300)',
        400: 'var(--blue-400)',
        500: 'var(--blue-500)',
        600: 'var(--blue-600)',
        700: 'var(--blue-700)',
        800: 'var(--blue-800)',
        900: 'var(--blue-900)',
      },
      purple: {
        100: 'var(--purple-100)',
        200: 'var(--purple-200)',
        300: 'var(--purple-300)',
        400: 'var(--purple-400)',
        500: 'var(--purple-500)',
        600: 'var(--purple-600)',
        700: 'var(--purple-700)',
        800: 'var(--purple-800)',
        900: 'var(--purple-900)',
      },
    },
  },
  plugins: [],
} satisfies Config
