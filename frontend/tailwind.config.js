/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07111f',
          900: '#0a1628',
          800: '#13253d',
        },
        gold: {
          400: '#f8c66c',
          500: '#f2a93b',
          600: '#d98c1f',
        },
        teal: {
          400: '#66d4c7',
          500: '#2cb9b0',
          600: '#159a95',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(242, 169, 59, 0.18), 0 24px 60px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'mesh-radial': 'radial-gradient(circle at top left, rgba(242, 169, 59, 0.22), transparent 34%), radial-gradient(circle at top right, rgba(44, 185, 176, 0.20), transparent 28%), linear-gradient(180deg, rgba(7,17,31,1) 0%, rgba(10,22,40,1) 100%)',
      },
    },
  },
  plugins: [],
};