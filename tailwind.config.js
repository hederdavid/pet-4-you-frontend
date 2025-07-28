/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/layouts/**/*.{vue,js,ts}',
    './src/pages/**/*.{vue,js,ts}',
    './src/components/**/*.{vue,js,ts}',
    './src/boot/**/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
