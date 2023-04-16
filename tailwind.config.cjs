/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      width: {
        'calc-full': 'calc(100% - 0.5rem)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class'
};
