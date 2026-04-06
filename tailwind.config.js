/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // The Editorial Muse - Sophisticated Brutalism
        'primary': {
          DEFAULT: '#5f5e5e', // Refined charcoal
          hover: '#424242',
          on: '#fefee5',
        },
        'accent': {
          DEFAULT: '#a54731', // Heritage terracotta
          hover: '#8c3c2a',
        },
        'bg': {
          main: '#fefee5', // Soft ivory surface
          surface: '#ffffff',
          card: '#f4f7ce', // Slight tonal shift for depth
        },
        'text': {
          main: '#363b12', // Deep moss/black
          muted: '#7f8454', // Muted olive
          inverse: '#fefee5',
        },
        'border': {
          subtle: '#e2e4c0', // Very light olive
          strong: '#b8bd88', // Medium olive
        },
      },
      borderRadius: {
        'radius-sm': '0px',
        'radius-md': '0px',
        'radius-lg': '0px',
        'radius-full': '9999px',
      },
      fontFamily: {
        'headline': ['"Noto Serif"', 'serif'],
        'body': ['"Manrope"', 'sans-serif'],
        'label': ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        'shadow-sm': '0 2px 4px rgba(54, 59, 18, 0.04)',
        'shadow-md': '0 10px 20px rgba(54, 59, 18, 0.06)',
        'shadow-lg': '0 20px 40px rgba(54, 59, 18, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
