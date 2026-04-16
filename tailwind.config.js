/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f8f7',
          100: '#e7ecea',
          200: '#cfd9d5',
          300: '#a9bbb5',
          400: '#7e9790',
          500: '#5f7871',
          600: '#4a605b',
          700: '#3d4f4b',
          800: '#32403d',
          900: '#2a3533',
        },
        accent: {
          50: '#fff6ef',
          100: '#ffe7d6',
          200: '#ffcdab',
          300: '#ffab73',
          400: '#ff8940',
          500: '#f36a14',
          600: '#d4540a',
          700: '#ad3f09',
          800: '#8a330f',
          900: '#702b10',
        },
        ink: '#111827',
        mist: '#eef4f2',
      },
      boxShadow: {
        soft: '0 14px 40px -24px rgba(17, 24, 39, 0.35)',
        panel: '0 24px 70px -36px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at top, rgba(255,255,255,0.85), rgba(255,255,255,0) 42%), linear-gradient(rgba(95,120,113,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(95,120,113,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-fade': 'auto, 32px 32px, 32px 32px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
};
