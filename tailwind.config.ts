import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c8a24a',
          light: '#d4b46a',
          dark: '#a8842e',
        },
        'near-black': '#0b0b0d',
        'off-white': '#f5f5f5',
        surface: '#141416',
        'surface-2': '#1c1c1f',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(200, 162, 74, 0.3)',
        'gold-lg': '0 0 20px rgba(200, 162, 74, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
