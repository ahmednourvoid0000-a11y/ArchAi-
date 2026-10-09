/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD166',
          light:   '#FFE29D',
          dark:    '#D4AF37',
          outline: '#BFA24A',
        },
        arch: {
          bg:      '#0D0D0D',
          surface: '#151515',
          card:    '#171717',
          border:  '#BFA24A',
          muted:   'rgba(255,255,255,0.55)',
          beige:   '#EAD7C2',
        },
      },
      fontFamily: {
        body:    ['Poppins', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'input': '16px',
        'btn':   '18px',
        'card':  '28px',
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease forwards',
        'shimmer':   'shimmer 2s infinite',
        'spin-logo': 'spin-logo 10s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'spin-logo': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
