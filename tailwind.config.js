/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14B0B0',   // 400 — main brand teal
          light:   '#1CDBDB',   // 200 — lighter teal
          bright:  '#21F8F8',   // 100 — vivid teal
          pale:    '#AFFFFF',   // 50  — softest tint
          dark:    '#0E9090',   // 500 — deep teal
        },
        accent: {
          DEFAULT: '#FFD166',   // warm yellow — complements teal perfectly for kids
          light:   '#FFF0BB',
          dark:    '#E6B840',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          light:   '#FFB3B3',
        },
        surface: '#D4EFEF',     // deeper teal tint for better logo visibility
        muted:   '#4A7A7A',
        dark:    '#0D2B2B',     // deep teal-black
        
        // Dark Mode Additions
        'dark-surface': '#061D1D',
        'dark-card': '#0A2525',
        'dark-muted': '#A4C4C4',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:       '0 4px 20px rgba(20, 176, 176, 0.10)',
        'card-hover':'0 8px 32px rgba(20, 176, 176, 0.22)',
        soft:       '0 2px 12px rgba(0,0,0,0.06)',
        glow:       '0 0 24px rgba(28, 219, 219, 0.30)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'wave-drift': 'waveDrift 6s ease-in-out infinite alternate',
        'bob':        'bob 3s ease-in-out infinite',
        'fadeInUp':   'fadeInUp 0.2s ease',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        waveDrift: {
          '0%':   { d: 'path("M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z")' },
          '100%': { d: 'path("M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z")' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%':   { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0)   scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
