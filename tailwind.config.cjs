const plugin = require('tailwindcss/plugin');

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
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-default': {
          /* IE and Edge */
          '-ms-overflow-style': 'auto',
          /* Firefox */
          'scrollbar-width': 'auto',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'block'
          }
        },
        '.btn': {
          'align-items': 'center',
          'border-color': 'transparent',
          'border-radius': '0.25rem',
          'border-width': '1px',
          'display': 'inline-flex',
          'font-size': '.875rem',
          'line-height': '1.25rem',
          'padding': '0.5rem 0.75rem',
          'pointer-events': 'auto',
        },
        '.text-overflow-l4': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        }
      }, ['responsive'])
    })
  ],
  darkMode: 'class'
};
