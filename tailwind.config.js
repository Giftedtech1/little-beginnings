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
          DEFAULT: '#0192c6',   // main brand blue
          light:   '#4abbee',   // lighter blue
          bright:  '#aae1f6',   // vivid light blue
          pale:    '#e6f6fb',   // softest tint
          dark:    '#016a91',   // deep blue
        },
        accent: {
          DEFAULT: '#FFD166',   // warm yellow — complements blue perfectly for kids
          light:   '#FFF0BB',
          dark:    '#E6B840',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          light:   '#FFB3B3',
        },
        surface: '#d1ecf7',     // blue tint for better logo visibility
        muted:   '#4a687a',     // muted slate blue
        dark:    '#0a1c2b',     // deep blue-black
        
        // Dark Mode Additions
        'dark-surface': '#05131d',
        'dark-card': '#081a25',
        'dark-muted': '#a4b8c4',
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
